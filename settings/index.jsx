function mySettings(props) {
  return (
    <Page>
      <Section
        title={<Text bold align="center">Demo Settings</Text>}>
        <Toggle
          settingsKey="toggle"
          label="Toggle Switch"
        />
        <ColorSelect
          settingsKey="color"
          colors={[
            {color: "#e0af00"},
            {color: "#490058"},
            {color: "#2f4d4c"},
            {color: "#282780"},
            {color: "#777"}
          ]}
        />
      </Section>
    </Page>
  );
}

registerSettingsPage(mySettings);