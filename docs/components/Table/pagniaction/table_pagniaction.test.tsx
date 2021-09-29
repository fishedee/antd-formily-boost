import NoPage from './noPage';
import LocalPage from './localPage';
import RemotePage from './remotePage';
import Radio from './radio';
import Checkbox from './checkbox';

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

test('NoPage', () => {
    const { asFragment } = render(<NoPage />);
    expect(asFragment()).toMatchSnapshot();
});

test('LocalPage', () => {
    const { asFragment } = render(<LocalPage />);
    expect(asFragment()).toMatchSnapshot();
});

test('RemotePage', () => {
    const { asFragment } = render(<RemotePage />);
    expect(asFragment()).toMatchSnapshot();
});

test('Radio', () => {
    const { asFragment } = render(<Radio />);
    expect(asFragment()).toMatchSnapshot();
});

test('Checkbox', () => {
    const { asFragment } = render(<Checkbox />);
    expect(asFragment()).toMatchSnapshot();
});
