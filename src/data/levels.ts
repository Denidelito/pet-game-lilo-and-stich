export interface LevelData {
    theme: string;
    wordsToReachBoss: string[];
    wordsToDefeatBoss: string[];
    bossTexture: string;
}

export const levels: LevelData[] = [
    {
        theme: 'Пляж',
        wordsToReachBoss: ['ПЕСОК', 'МОРЕ', 'ЗОНТ'],
        wordsToDefeatBoss: ['КРЕМ', 'ШАПКА', 'ПЛЯЖ'],
        bossTexture: 'boss-beach',
    },
    {
        theme: 'Космос',
        wordsToReachBoss: ['КОРАБЛЬ', 'РАКЕТА', 'ЛУНА'],
        wordsToDefeatBoss: ['ШЛЕМ', 'КОСТЮМ', 'КОМЕТА'],
        bossTexture: 'boss-space',
    },
    {
        theme: 'Лес',
        wordsToReachBoss: ['ДЕРЕВО', 'ШИШКА', 'ГРИБ'],
        wordsToDefeatBoss: ['МОХ', 'ЯГОДА', 'КУСТ'],
        bossTexture: 'boss-forest',
    },
    {
        theme: 'Город',
        wordsToReachBoss: ['МАШИНА', 'ДОМ', 'МОСТ'],
        wordsToDefeatBoss: ['СВЕТОФОР', 'ПАРК', 'ТРОТУАР'],
        bossTexture: 'boss-city',
    },
];
