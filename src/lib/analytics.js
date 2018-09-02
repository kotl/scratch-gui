const defaultMock = {
    pageview: () => {},
    event: () => {},
}

const GoogleAnalyticsMock = {
    default: defaultMock,
    ...defaultMock,
}

export default GoogleAnalyticsMock;
