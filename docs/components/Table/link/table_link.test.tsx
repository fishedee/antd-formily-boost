import Link from './link';
import LinkReact from './linkReact';
import { render } from '@testing-library/react';
import React from 'react';

beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
        value: jest.fn(() => {
            return {
                matches: true,
                addListener: jest.fn(),
                removeListener: jest.fn(),
            };
        }),
    });
});

test('Link', () => {
    const { asFragment } = render(<Link />);
    expect(asFragment()).toMatchSnapshot();
});

test('LinkReact', () => {
    const { asFragment } = render(<LinkReact />);
    expect(asFragment()).toMatchSnapshot();
});
