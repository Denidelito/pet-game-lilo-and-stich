import type { SDK } from 'ysdk';

declare global {
    interface Window {
        YaGames?: {
            init: () => Promise<SDK>;
        };
    }
}

export const initYandexSDK = async (): Promise<SDK | null> => {
    if (!window.YaGames) {
        console.warn('Yandex SDK не загружен');
        return null;
    }

    try {
        const sdk = await window.YaGames.init();
        return sdk;
    } catch (e) {
        console.error('Ошибка инициализации YSDK:', e);
        return null;
    }
};
