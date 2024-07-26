import { FluentThemeProvider, DevicesButton } from '@azure/communication-react';
import { IContextualMenuProps } from '@fluentui/react';
import React from 'react';

const exampleOptionsMenuProps: IContextualMenuProps = {
  items: [
    {
      key: '1',
      name: 'Choose Camera',
      iconProps: { iconName: 'LocationCircle' },
      onClick: () => alert('Choose Camera Menu Item Clicked!')
    }
  ]
};

export const DevicesButtonDefaultExample: () => JSX.Element = () => {
  return (
    <FluentThemeProvider>
      <DevicesButton menuProps={exampleOptionsMenuProps} />
    </FluentThemeProvider>
  );
};
