import "@testing-library/jest-dom";
jest.mock('@inertiajs/react', () => ({
    Link: (props) => <a {...props} />,
    usePage: () => ({
        props: {},
    }),
    router: {
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
    },
}));

// Mock Laravel Ziggy route() helper
global.route = jest.fn((name, params = {}) => {
    const query = Object.entries(params)
        .map(([k, v]) => `${k}=${v}`)
        .join('&');

    return `/${name}${query ? '?' + query : ''}`;
});
