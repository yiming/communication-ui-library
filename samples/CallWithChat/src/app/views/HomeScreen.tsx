// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useMemo, useState } from 'react';
import { Stack, PrimaryButton, Image, ChoiceGroup, IChoiceGroupOption, Text, TextField } from '@fluentui/react';
/* @conditional-compile-remove(PSTN-calls) */
import { registerIcons, Label, Link, Callout, mergeStyles } from '@fluentui/react';
import heroSVG from '../../assets/hero.svg';
import {
  imgStyle,
  infoContainerStyle,
  callContainerStackTokens,
  callOptionsGroupStyles,
  configContainerStyle,
  configContainerStackTokens,
  containerStyle,
  containerTokens,
  headerStyle,
  teamsItemStyle,
  buttonStyle
} from '../styles/HomeScreen.styles';
/* @conditional-compile-remove(PSTN-calls) */
import {
  outboundTextField,
  dialpadOptionStyles,
  alternateCallerIdCalloutStyles,
  alternateCallerIdCalloutTitleStyles,
  alternateCallerIdCalloutLinkStyles
} from '../styles/HomeScreen.styles';
import { ThemeSelector } from '../theming/ThemeSelector';
import { localStorageAvailable } from '../utils/localStorage';
import { getDisplayNameFromLocalStorage, saveDisplayNameToLocalStorage } from '../utils/localStorage';
import { DisplayNameField } from './DisplayNameField';
import { TeamsMeetingLinkLocator } from '@azure/communication-calling';
import { TeamsMeetingIdLocator } from '@azure/communication-calling';
/* @conditional-compile-remove(PSTN-calls) */
import { Dialpad } from '@azure/communication-react';
/* @conditional-compile-remove(PSTN-calls) */
import { Backspace20Regular } from '@fluentui/react-icons';
/* @conditional-compile-remove(PSTN-calls) */
import { useIsMobile } from '../utils/useIsMobile';
/* @conditional-compile-remove(rich-text-editor-composite-support) */
import { RichTextEditorToggle } from './RichTextEditorToggle';

export interface HomeScreenProps {
  startCallHandler(callDetails: {
    displayName: string;
    meetingLocator?: TeamsMeetingLinkLocator | TeamsMeetingIdLocator;
    /* @conditional-compile-remove(one-to-n-calling)  */
    outboundParticipants?: string[];
    /* @conditional-compile-remove(PSTN-calls) */
    alternateCallerId?: string;
    /* @conditional-compile-remove(rich-text-editor-composite-support) */
    isRichTextEditorEnabled?: boolean;
  }): void;
  joiningExistingCall: boolean;
}

export const HomeScreen = (props: HomeScreenProps): JSX.Element => {
  const { startCallHandler } = props;
  const imageProps = { src: heroSVG.toString() };
  const headerTitle = props.joiningExistingCall ? 'Join Call with Chat' : 'Start or join a Call with Chat';
  const callOptionsGroupLabel = 'Select an option';
  const buttonText = 'Next';
  const callOptions: IChoiceGroupOption[] = [
    { key: 'ACSCallWithChat', text: 'Start a ACS Call with Chat' },
    { key: 'TeamsMeeting', text: 'Join a Teams Meeting' },
    /* @conditional-compile-remove(one-to-n-calling) */
    { key: '1:N', text: 'Start a 1:N ACS Call' },
    /* @conditional-compile-remove(PSTN-calls) */
    { key: 'PSTN', text: 'Start a PSTN Call' }
  ];

  /* @conditional-compile-remove(rich-text-editor-composite-support) */
  const [isRichTextEditorEnabled, setIsRichTextEditorEnabled] = useState<boolean>(false);

  // Get display name from local storage if available
  const defaultDisplayName = localStorageAvailable ? getDisplayNameFromLocalStorage() : null;
  const [displayName, setDisplayName] = useState<string | undefined>(defaultDisplayName ?? undefined);

  const [chosenCallOption, setChosenCallOption] = useState<IChoiceGroupOption>(callOptions[0]);
  const [meetingLocator, setMeetingLocator] = useState<TeamsMeetingLinkLocator | TeamsMeetingIdLocator>();
  const [meetingId, setMeetingId] = useState<string>();
  const [passcode, setPasscode] = useState<string>();

  /* @conditional-compile-remove(PSTN-calls) */
  const [alternateCallerId, setAlternateCallerId] = useState<string>();
  /* @conditional-compile-remove(one-to-n-calling)  */
  const [outboundParticipants, setOutboundParticipants] = useState<string>();
  /* @conditional-compile-remove(PSTN-calls) */
  const [dialpadParticipant, setDialpadParticipant] = useState<string>();

  /* @conditional-compile-remove(PSTN-calls) */
  const [alternateCallerIdCalloutVisible, setAlternateCallerIdCalloutVisible] = useState<boolean>(false);

  const teamsCallChosen: boolean = chosenCallOption.key === 'TeamsMeeting';
  const startGroupCall: boolean = chosenCallOption.key === 'ACSCallWithChat';
  /* @conditional-compile-remove(PSTN-calls) */
  const pstnCallChosen: boolean = chosenCallOption.key === 'PSTN';
  /* @conditional-compile-remove(one-to-n-calling)  */
  const acsCallChosen: boolean = chosenCallOption.key === '1:N';
  const buttonEnabled =
    displayName &&
    (startGroupCall ||
      meetingLocator ||
      (teamsCallChosen && meetingLocator) ||
      /* @conditional-compile-remove(PSTN-calls) */ (pstnCallChosen && dialpadParticipant && alternateCallerId) ||
      /* @conditional-compile-remove(one-to-n-calling) */ (outboundParticipants && acsCallChosen));

  /* @conditional-compile-remove(PSTN-calls) */
  registerIcons({ icons: { DialpadBackspace: <Backspace20Regular /> } });

  const richTextEditorToggle = useMemo((): JSX.Element => {
    /* @conditional-compile-remove(rich-text-editor-composite-support) */
    return <RichTextEditorToggle setRichTextEditorIsEnabled={setIsRichTextEditorEnabled} />;
    return <></>;
  }, [/* @conditional-compile-remove(rich-text-editor-composite-support) */ setIsRichTextEditorEnabled]);

  /* @conditional-compile-remove(PSTN-calls) */
  const isMobileSession = useIsMobile();
  return (
    <Stack
      horizontal
      wrap
      horizontalAlign="center"
      verticalAlign="center"
      tokens={containerTokens}
      className={containerStyle}
    >
      <Image alt="Welcome to the ACS Call with Chat sample app" className={imgStyle} {...imageProps} />
      <Stack className={infoContainerStyle}>
        <Text role={'heading'} aria-level={1} className={headerStyle}>
          {headerTitle}
        </Text>
        <Stack className={configContainerStyle} tokens={configContainerStackTokens}>
          <Stack tokens={callContainerStackTokens}>
            {!props.joiningExistingCall && (
              <ChoiceGroup
                styles={callOptionsGroupStyles}
                label={callOptionsGroupLabel}
                defaultSelectedKey="ACSCallWithChat"
                options={callOptions}
                required={true}
                onChange={(_, option) => option && setChosenCallOption(option)}
              />
            )}
            {teamsCallChosen && (
              <TextField
                className={teamsItemStyle}
                iconProps={{ iconName: 'Link' }}
                label={'Meeting Link'}
                required
                placeholder={'Enter a Teams meeting link'}
                onChange={(_, newValue) => {
                  newValue ? setMeetingLocator({ meetingLink: newValue }) : setMeetingLocator(undefined);
                }}
              />
            )}
            {teamsCallChosen && (
              <Text className={teamsItemStyle} block variant="medium">
                <b>Or</b>
              </Text>
            )}
            {teamsCallChosen && (
              <TextField
                className={teamsItemStyle}
                iconProps={{ iconName: 'MeetingId' }}
                label={'Meeting Id'}
                required
                placeholder={'Enter a meeting id'}
                onChange={(_, newValue) => {
                  setMeetingId(newValue);
                  newValue
                    ? setMeetingLocator({ meetingId: newValue, passcode: passcode })
                    : setMeetingLocator(undefined);
                }}
              />
            )}
            {teamsCallChosen && (
              <TextField
                className={teamsItemStyle}
                iconProps={{ iconName: 'passcode' }}
                label={'Passcode'}
                placeholder={'Enter a meeting passcode'}
                onChange={(_, newValue) => {
                  // meeting id is required, but passcode is not
                  setPasscode(newValue);
                  meetingId
                    ? setMeetingLocator({ meetingId: meetingId, passcode: newValue })
                    : setMeetingLocator(undefined);
                }}
              />
            )}
            {teamsCallChosen && (
              <Text className={teamsItemStyle} block variant="medium">
                <b>And</b>
              </Text>
            )}
            {
              /* @conditional-compile-remove(one-to-n-calling) */ acsCallChosen && (
                <Stack>
                  <TextField
                    className={outboundTextField}
                    label={'Participants'}
                    required
                    placeholder={"Comma seperated phone numbers or ACS ID's"}
                    onChange={(_, newValue) => newValue && setOutboundParticipants(newValue)}
                  />
                </Stack>
              )
            }
            {
              /* @conditional-compile-remove(PSTN-calls) */ pstnCallChosen && (
                <Stack>
                  <Stack>
                    <Label required style={{ paddingBottom: '0.5rem' }}>
                      Please dial the number you wish to call.
                    </Label>
                    <Stack styles={dialpadOptionStyles}>
                      <Dialpad
                        longPressTrigger={isMobileSession ? 'touch' : 'mouseAndTouch'}
                        onChange={(newValue) => {
                          /**
                           * We need to pass in the formatting for the phone number string in the onChange handler
                           * to make sure the phone number is in E.164 format.
                           *
                           * write regexp to flatten this
                           */
                          const phoneNumber = '+' + newValue?.replace(/\D/g, '');
                          setDialpadParticipant(phoneNumber);
                        }}
                      />
                    </Stack>
                    <TextField
                      id={'alternateCallerId-input'}
                      className={outboundTextField}
                      required={true}
                      label={'Azure Communication Services phone number for caller ID'}
                      placeholder={'Please enter phone number'}
                      onChange={(_, newValue) => setAlternateCallerId(newValue)}
                      onFocus={() => setAlternateCallerIdCalloutVisible(true)}
                    />
                    {alternateCallerIdCalloutVisible && (
                      <Callout
                        role="dialog"
                        gapSpace={0}
                        target={document.getElementById('alternateCallerId-input')}
                        className={mergeStyles(alternateCallerIdCalloutStyles)}
                        onDismiss={() => setAlternateCallerIdCalloutVisible(false)}
                      >
                        <Text block className={mergeStyles(alternateCallerIdCalloutTitleStyles)} variant="large">
                          AlternateCallerId
                        </Text>
                        <ul>
                          <li>This number will act as your caller id when no display name is provided.</li>
                          <li>Must be from same Azure Communication Services resource as the user making the call.</li>
                        </ul>
                        <Link
                          className={mergeStyles(alternateCallerIdCalloutLinkStyles)}
                          target="_blank"
                          href="https://learn.microsoft.com/en-us/azure/communication-services/concepts/telephony/plan-solution"
                        >
                          Learn more about phone numbers and Azure Communication Services.
                        </Link>
                      </Callout>
                    )}
                  </Stack>
                </Stack>
              )
            }
          </Stack>
          <DisplayNameField defaultName={displayName} setName={setDisplayName} />
          <PrimaryButton
            disabled={!buttonEnabled}
            className={buttonStyle}
            text={buttonText}
            onClick={() => {
              if (displayName) {
                saveDisplayNameToLocalStorage(displayName);
                /* @conditional-compile-remove(one-to-n-calling)  */
                const acsParticipantsToCall = parseParticipants(outboundParticipants);
                /* @conditional-compile-remove(PSTN-calls) */
                const dialpadParticipantToCall = parseParticipants(dialpadParticipant);
                startCallHandler({
                  displayName,
                  meetingLocator,
                  /* @conditional-compile-remove(PSTN-calls) */ alternateCallerId,
                  /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling)  */
                  outboundParticipants: acsParticipantsToCall ? acsParticipantsToCall : dialpadParticipantToCall,
                  /* @conditional-compile-remove(rich-text-editor-composite-support) */
                  isRichTextEditorEnabled: isRichTextEditorEnabled
                });
              }
            }}
          />
          <div>
            <ThemeSelector label="Theme" horizontal={true} />
            {richTextEditorToggle}
          </div>
        </Stack>
      </Stack>
    </Stack>
  );
};

/* @conditional-compile-remove(one-to-n-calling)  */ /* @conditional-compile-remove(PSTN-calls) */
/**
 * splits the participant Id's so we can call multiple people.
 */
const parseParticipants = (participantsString?: string): string[] | undefined => {
  if (participantsString) {
    return participantsString.replaceAll(' ', '').split(',');
  } else {
    return undefined;
  }
};
