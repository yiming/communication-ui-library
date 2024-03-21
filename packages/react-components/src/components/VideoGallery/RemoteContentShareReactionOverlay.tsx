// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(reaction) */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
/* @conditional-compile-remove(reaction) */
import { Reaction, ReactionResources, VideoGalleryLocalParticipant, VideoGalleryRemoteParticipant } from '../../types';
/* @conditional-compile-remove(reaction) */
import { Stack, mergeStyles } from '@fluentui/react';
/* @conditional-compile-remove(reaction) */
import { videoContainerStyles } from '../styles/VideoTile.styles';
/* @conditional-compile-remove(reaction) */
import { getEmojiResource } from './utils/videoGalleryLayoutUtils';
/* @conditional-compile-remove(reaction) */
import {
  IReactionStyleBucket,
  generateStartPositionWave,
  getReactionMovementStyle,
  getReactionStyleBucket,
  moveAnimationStyles,
  opacityAnimationStyles,
  reactionOverlayStyle,
  spriteAnimationStyles
} from '../styles/ReactionOverlay.style';
/* @conditional-compile-remove(reaction) */
import {
  REACTION_NUMBER_OF_ANIMATION_FRAMES,
  REACTION_SCREEN_SHARE_ANIMATION_TIME_MS,
  REACTION_START_DISPLAY_SIZE,
  getCombinedKey,
  getReceivedUnixTime
} from './utils/reactionUtils';

/* @conditional-compile-remove(reaction) */
type VisibleReaction = {
  reaction: Reaction;
  id: string;
  reactionMovementIndex: number;
  styleBucket: IReactionStyleBucket;
};

/* @conditional-compile-remove(reaction) */
type ReceivedReaction = {
  id: string;
  status: 'animating' | 'completedAnimating' | 'ignored';
};

/* @conditional-compile-remove(reaction) */
/**
 * The overlay responsible for rendering multiple reactions all at once in presentation mode
 * @internal
 */
export const RemoteContentShareReactionOverlay = React.memo(
  (props: {
    reactionResources: ReactionResources;
    localParticipant?: VideoGalleryLocalParticipant;
    remoteParticipants?: VideoGalleryRemoteParticipant[];
    hostDivHeight?: number;
    hostDivWidth?: number;
  }) => {
    const { reactionResources, localParticipant, remoteParticipants, hostDivHeight, hostDivWidth } = props;

    // Reactions that are currently being animated
    const [visibleReactions, setVisibleReactions] = useState<VisibleReaction[]>([]);

    // Dict of userId to a reaction status. This is used to track the latest received reaction
    // per user to avoid animating the same reaction multiple times and to limit the number of
    // active reactions of a certain type.
    const latestReceivedReaction = useRef<Record<string, ReceivedReaction>>({});

    // Track the number of active reactions of each type to limit the number of active reactions
    // of a certain type.
    const activeTypeCount = useRef<Record<string, number>>({
      like: 0,
      heart: 0,
      laugh: 0,
      applause: 0,
      surprised: 0
    });

    // Used to track the total number of reactions ever played. This is a helper variable
    // to calculate the reaction movement index (i.e. the .left position of the reaction)
    const visibleReactionPosition = useRef<boolean[]>(new Array<boolean>(55).fill(false));

    const remoteParticipantReactions: Reaction[] = useMemo(
      () =>
        remoteParticipants
          ?.map((remoteParticipant) => remoteParticipant.reaction)
          .filter((reaction): reaction is Reaction => !!reaction) ?? [],
      [remoteParticipants]
    );

    // We can optimize this by applying data structure algorithm and bring this search to log2 N
    const findFirstEmptyPosition = (): number => {
      return visibleReactionPosition.current.findIndex((item) => item === false);
    };

    const updateVisibleReactions = useCallback(
      (reaction: Reaction, userId: string): void => {
        const combinedKey = getCombinedKey(userId, reaction.reactionType, reaction.receivedOn);

        const alreadyHandled = latestReceivedReaction.current[userId]?.id === combinedKey;
        if (alreadyHandled) {
          return;
        }

        const activeCount = activeTypeCount.current[reaction.reactionType];
        // Limit the number of active reactions of a certain type to 10
        if (activeCount >= 10) {
          latestReceivedReaction.current[userId] = {
            id: combinedKey,
            status: 'ignored'
          };
          return;
        }

        activeTypeCount.current[reaction.reactionType] += 1;
        latestReceivedReaction.current[userId] = {
          id: combinedKey,
          status: 'animating'
        };
        const reactionMovementIndex = findFirstEmptyPosition();
        visibleReactionPosition.current[reactionMovementIndex] = true;
        setVisibleReactions([
          ...visibleReactions,
          {
            reaction: reaction,
            id: combinedKey,
            reactionMovementIndex: reactionMovementIndex,
            styleBucket: getReactionStyleBucket(reactionMovementIndex)
          }
        ]);
        return;
      },
      [activeTypeCount, visibleReactions]
    );

    const removeVisibleReaction = (reactionType: string, id: string, index: number): void => {
      setVisibleReactions(visibleReactions.filter((reaction) => reaction.id !== id));
      visibleReactionPosition.current[index] = false;
      activeTypeCount.current[reactionType] -= 1;
      Object.entries(latestReceivedReaction.current).forEach(([userId, reaction]) => {
        if (reaction.id === id) {
          latestReceivedReaction.current[userId].status = 'completedAnimating';
        }
      });
    };

    // Update visible reactions when local participant sends a reaction
    useEffect(() => {
      if (localParticipant?.reaction) {
        updateVisibleReactions(localParticipant.reaction, localParticipant.userId);
      }
    }, [localParticipant, updateVisibleReactions]);

    // Update visible reactions when remote participants send a reaction
    useEffect(() => {
      remoteParticipants?.map((participant) => {
        if (participant?.reaction) {
          updateVisibleReactions(participant.reaction, participant.userId);
        }
      });
    }, [remoteParticipantReactions, remoteParticipants, updateVisibleReactions]);

    // Note: canRenderReaction shouldn't be needed as we remove the animation on the onAnimationEnd event
    const canRenderReaction = (reaction: Reaction, id: string, movementIndex: number): boolean => {
      // compare current time to reaction.received at and see if more than 4 seconds has elapsed
      const canRender = Date.now() - getReceivedUnixTime(reaction.receivedOn) < REACTION_SCREEN_SHARE_ANIMATION_TIME_MS;

      // Clean up the reaction if it's not in the visible reaction list
      if (!canRender) {
        removeVisibleReaction(reaction?.reactionType, id, movementIndex);
      }

      return canRender;
    };

    const containerHeight = hostDivHeight ?? 0;
    const containerWidth = hostDivWidth ?? REACTION_START_DISPLAY_SIZE - REACTION_START_DISPLAY_SIZE;

    const styleBucket = (activeSprites: number): IReactionStyleBucket => getReactionStyleBucket(activeSprites);
    const displaySizePx = (activeSprites: number): number =>
      REACTION_START_DISPLAY_SIZE * styleBucket(activeSprites).sizeScale;

    const leftPosition = (position: number): number =>
      generateStartPositionWave(position, containerWidth / 2, true /* isOriginAtCanvasCenter */);
    const reactionMovementStyle = (position: number): React.CSSProperties =>
      getReactionMovementStyle(leftPosition(position));

    return (
      <Stack
        className={mergeStyles(videoContainerStyles, {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'transparent'
        })}
      >
        {visibleReactions.map((reaction) => (
          <div key={reaction.id} style={reactionOverlayStyle}>
            <div className="reaction-item">
              {canRenderReaction(reaction.reaction, reaction.id, reaction.reactionMovementIndex) && (
                // First div - Section that fixes the travel height and applies the movement animation
                // Second div - Keeps track of active sprites and responsible for marking, counting and removing reactions
                // Third div - Responsible for opacity controls as the sprite emoji animates
                // Fourth div - Responsible for calculating the point of X axis where the reaction will start animation
                // Fifth div - Play Animation as the other animation applies on the base play animation for the sprite
                <div
                  style={moveAnimationStyles(
                    containerHeight / 2, // dividing by two because reactionOverlayStyle height is set to 50%
                    (containerHeight / 2) * (1 - reaction.styleBucket.heightMaxScale)
                  )}
                >
                  <div>
                    <div
                      onAnimationEnd={() => {
                        removeVisibleReaction(
                          reaction.reaction.reactionType,
                          reaction.id,
                          reaction.reactionMovementIndex
                        );
                      }}
                      style={opacityAnimationStyles(reaction.styleBucket.opacityMax)}
                    >
                      <div style={reactionMovementStyle(reaction.reactionMovementIndex)}>
                        <div
                          style={spriteAnimationStyles(
                            REACTION_NUMBER_OF_ANIMATION_FRAMES,
                            displaySizePx(visibleReactions.length),
                            getEmojiResource(reaction?.reaction.reactionType, reactionResources) ?? ''
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </Stack>
    );
  }
);
