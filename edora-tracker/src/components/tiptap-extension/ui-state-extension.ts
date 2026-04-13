import { Extension } from '@tiptap/core';

export interface UiState {
    [key: string]: any;
}

export const defaultUiState: UiState = {};

export const UiStateExtension = Extension.create({
    name: 'uiState',
    addStorage() {
        return {
            ...defaultUiState,
        };
    },
});
