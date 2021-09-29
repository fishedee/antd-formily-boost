import Basic from './basic';
import Style from './labelIndex';
import None from './none';
import UserInput from './userInput';
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

test('Basic', () => {
    const { asFragment } = render(<Basic />);
    expect(asFragment()).toMatchSnapshot();
});

test('Style', () => {
    const { asFragment } = render(<Style />);
    expect(asFragment()).toMatchSnapshot();
});

test('None', () => {
    const { asFragment } = render(<None />);
    expect(asFragment()).toMatchSnapshot();
});

test('UserInput', () => {
    const { asFragment } = render(<UserInput />);
    expect(asFragment()).toMatchSnapshot();
});
