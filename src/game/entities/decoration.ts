import { Vec2, Util } from '../util';
import { Action, Cursor, DecorAction, DecorMode, GameObject, Game } from '../engine';



//Layers & presets
enum DecorationLayer { 
    DEFAULT = 0,
    CUSHIONS = -10,
    RUGS = -20
}

interface DecorationPreset {
    name: string
    size: Vec2
    spriteOffset: Vec2
    sortingLayer?: DecorationLayer
    price: number
}

export const DecorationPresets: Record<string, Record<string, DecorationPreset>> = {

    //Chairs
    CHAIRS: {
        OAK_CHAIR: {
            name: 'Oak Chair',
            size: new Vec2(16, 32),
            spriteOffset: new Vec2(0, 0),
            price: 350,
        },
        WALNUT_CHAIR: {
            name: 'Walnut Chair',
            size: new Vec2(16, 32),
            spriteOffset: new Vec2(48, 0),
            price: 350,
        },
        BIRCH_CHAIR: {
            name: 'Birch Chair',
            size: new Vec2(16, 32),
            spriteOffset: new Vec2(96, 0),
            price: 350,
        },
        MAHOGANY_CHAIR: {
            name: 'Mahogany Chair',
            size: new Vec2(16, 32),
            spriteOffset: new Vec2(144, 0),
            price: 1000,
        },
        RED_DINER_CHAIR: {
            name: 'Red Diner Chair',
            size: new Vec2(16, 32),
            spriteOffset: new Vec2(192, 0),
            price: 750,
        },
        BLUE_DINER_CHAIR: {
            name: 'Blue Diner Chair',
            size: new Vec2(16, 32),
            spriteOffset: new Vec2(240, 0),
            price: 750,
        },
        COUNTRY_CHAIR: {
            name: 'Country Chair',
            size: new Vec2(16, 32),
            spriteOffset: new Vec2(288, 0),
            price: 750,
        },
        BREAKFAST_CHAIR: {
            name: 'Breakfast Chair',
            size: new Vec2(16, 32),
            spriteOffset: new Vec2(336, 0),
            price: 750,
        },
        PINK_OFFICE_CHAIR: {
            name: 'Pink Office Chair',
            size: new Vec2(16, 32),
            spriteOffset: new Vec2(384, 0),
            price: 500,
        },
        PURPLE_OFFICE_CHAIR: {
            name: 'Purple Office Chair',
            size: new Vec2(16, 32),
            spriteOffset: new Vec2(432, 0),
            price: 500,
        },
        DARK_THRONE: {
            name: 'Dark Throne',
            size: new Vec2(16, 32),
            spriteOffset: new Vec2(0, 32),
            price: 2000,
        },
        DINING_CHAIR_YELLOW: {
            name: 'Dining Chair Yellow',
            size: new Vec2(16, 32),
            spriteOffset: new Vec2(48, 32),
            price: 1200,
        },
        DINING_CHAIR_RED: {
            name: 'Dining Chair Red',
            size: new Vec2(16, 32),
            spriteOffset: new Vec2(96, 32),
            price: 1200,
        },
        GREEN_PLUSH_SEAT: {
            name: 'Green Plush Seat',
            size: new Vec2(16, 32),
            spriteOffset: new Vec2(144, 32),
            price: 750,
        },
        PINK_PLUSH_SEAT: {
            name: 'Pink Plush Seat',
            size: new Vec2(16, 32),
            spriteOffset: new Vec2(192, 32),
            price: 750,
        },
        WINTER_CHAIR: {
            name: 'Winter Chair',
            size: new Vec2(16, 32),
            spriteOffset: new Vec2(240, 32),
            price: 750,
        },
        GROOVY_CHAIR: {
            name: 'Groovy Chair',
            size: new Vec2(16, 32),
            spriteOffset: new Vec2(288, 32),
            price: 750,
        },
        CUTE_CHAIR: {
            name: 'Cute Chair',
            size: new Vec2(16, 32),
            spriteOffset: new Vec2(336, 32),
            price: 1200,
        },
        STUMP_SEAT: {
            name: 'Stump Seat',
            size: new Vec2(16, 32),
            spriteOffset: new Vec2(384, 32),
            price: 2000,
        },
        METAL_CHAIR: {
            name: 'Metal Chair',
            size: new Vec2(16, 32),
            spriteOffset: new Vec2(432, 32),
            price: 800,
        },
        KING_CHAIR: {
            name: 'King Chair',
            size: new Vec2(16, 32),
            spriteOffset: new Vec2(0, 64),
            price: 3000,
        },
        CRYSTAL_CHAIR: {
            name: 'Crystal Chair',
            size: new Vec2(16, 32),
            spriteOffset: new Vec2(48, 64),
            price: 2500,
        },
        TROPICAL_CHAIR: {
            name: 'Tropical Chair',
            size: new Vec2(16, 32),
            spriteOffset: new Vec2(96, 64),
            price: 2500, //Invented price
        },
        DESERT_CHAIR: {
            name: 'Desert Chair',
            size: new Vec2(16, 32),
            spriteOffset: new Vec2(544, 80),
            price: 1000, //Invented price
        },
        JOJA_CHAIR: {
            name: 'Joja Chair',
            size: new Vec2(16, 32),
            spriteOffset: new Vec2(896, 432),
            price: 1000, //Invented price
        },
        WIZARD_CHAIR: {
            name: 'Wizard Chair',
            size: new Vec2(16, 32),
            spriteOffset: new Vec2(592, 1152),
            price: 1000, //Invented price
        },
        JUNIMO_CHAIR: {
            name: 'Junimo Chair',
            size: new Vec2(16, 32),
            spriteOffset: new Vec2(848, 80),
            price: 1000, //Invented price
        },
        RETRO_CHAIR: {
            name: 'Retro Chair',
            size: new Vec2(16, 32),
            spriteOffset: new Vec2(672, 848),
            price: 1000, //Invented price
        },
        PLASTIC_LAWN_CHAIR: {
            name: 'Plastic Lawn Chair',
            size: new Vec2(16, 32),
            spriteOffset: new Vec2(640, 608),
            price: 350, //Invented price
        }
    },

    STOOLS: {
        GREEN_OFFICE_STOOL: {
            name: 'Green Office Stool',
            size: new Vec2(16, 32),
            spriteOffset: new Vec2(480, 0),
            price: 350,
        },
        ORANGE_OFFICE_STOOL: {
            name: 'Orange Office Stool',
            size: new Vec2(16, 32),
            spriteOffset: new Vec2(496, 0),
            price: 350,
        },
        GREEN_STOOL: {
            name: 'Green Stool',
            size: new Vec2(16, 32),
            spriteOffset: new Vec2(480, 32),
            price: 350,
        },
        BLUE_STOOL: {
            name: 'Blue Stool',
            size: new Vec2(16, 32),
            spriteOffset: new Vec2(496, 32),
            price: 350,
        },
        JOJA_STOOL: {
            name: 'Joja Stool',
            size: new Vec2(16),
            spriteOffset: new Vec2(896, 736),
            price: 500, //Invented price
        },
        WIZARD_STOOL: {
            name: 'Wizard Stool',
            size: new Vec2(16),
            spriteOffset: new Vec2(688, 1088),
            price: 500, //Invented price
        },
        JUNIMO_STOOL: {
            name: 'Junimo Stool',
            size: new Vec2(16),
            spriteOffset: new Vec2(880, 64),
            price: 500, //Invented price
        },
        RETRO_STOOL: {
            name: 'Retro Stool',
            size: new Vec2(16),
            spriteOffset: new Vec2(640, 848),
            price: 500, //Invented price
        }
    },

    BENCHES: {
        OAK_BENCH: {
            name: 'Oak Bench',
            size: new Vec2(32, 32),
            spriteOffset: new Vec2(0, 96),
            price: 750,
        },
        WALNUT_BENCH: {
            name: 'Walnut Bench',
            size: new Vec2(32, 32),
            spriteOffset: new Vec2(80, 96),
            price: 750,
        },
        BIRCH_BENCH: {
            name: 'Birch Bench',
            size: new Vec2(32, 32),
            spriteOffset: new Vec2(160, 96),
            price: 750,
        },
        MAHOGANY_BENCH: {
            name: 'Mahogany Bench',
            size: new Vec2(32, 32),
            spriteOffset: new Vec2(240, 96),
            price: 2000,
        },
        MODERN_BENCH: {
            name: 'Modern Bench',
            size: new Vec2(32, 32),
            spriteOffset: new Vec2(320, 96),
            price: 2000,
        }
    },

    //Tables
    TABLES: {
        OAK_TABLE: {
            name: 'Oak Table',
            size: new Vec2(32, 48),
            spriteOffset: new Vec2(0, 560),
            price: 750,
        },
        WALNUT_TABLE: {
            name: 'Walnut Table',
            size: new Vec2(32, 48),
            spriteOffset: new Vec2(32, 560),
            price: 750,
        },
        BIRCH_TABLE: {
            name: 'Birch Table',
            size: new Vec2(32, 48),
            spriteOffset: new Vec2(64, 560),
            price: 750,
        },
        MAHOGANY_TABLE: {
            name: 'Mahogany Table',
            size: new Vec2(32, 48),
            spriteOffset: new Vec2(96, 560),
            price: 1500,
        },
        MODERN_TABLE: {
            name: 'Modern Table',
            size: new Vec2(32, 48),
            spriteOffset: new Vec2(192, 560),
            price: 1250,
        },
        WINTER_TABLE: {
            name: 'Winter Table',
            size: new Vec2(32, 48),
            spriteOffset: new Vec2(384, 560),
            price: 1250,
        },
        SUN_TABLE: {
            name: 'Sun Table',
            size: new Vec2(32, 48),
            spriteOffset: new Vec2(128, 560),
            price: 2500,
        },
        MOON_TABLE: {
            name: 'Moon Table',
            size: new Vec2(32, 48),
            spriteOffset: new Vec2(160, 560),
            price: 2500,
        },
        PUZZLE_TABLE: {
            name: 'Puzzle Table',
            size: new Vec2(32, 48),
            spriteOffset: new Vec2(352, 560),
            price: 1500,
        },
        CANDY_TABLE: {
            name: 'Candy Table',
            size: new Vec2(32, 48),
            spriteOffset: new Vec2(416, 560),
            price: 1000,
        },
        LUAU_TABLE: {
            name: 'Luau Table',
            size: new Vec2(32, 48),
            spriteOffset: new Vec2(448, 560),
            price: 1000,
        },
        DARK_TABLE: {
            name: 'Dark Table',
            size: new Vec2(32, 48),
            spriteOffset: new Vec2(480, 560),
            price: 2000,
        },
        DIVINER_TABLE: {
            name: 'Diviner Table',
            size: new Vec2(32, 48),
            spriteOffset: new Vec2(288, 560),
            price: 2250,
        },
        PUB_TABLE: {
            name: 'Pub Table',
            size: new Vec2(32, 48),
            spriteOffset: new Vec2(224, 560),
            price: 800,
        },
        LUXURY_TABLE: {
            name: 'Luxury Table',
            size: new Vec2(32, 48),
            spriteOffset: new Vec2(256, 560),
            price: 2000,
        },
        NEOLITHIC_TABLE: {
            name: 'Neolithic Table',
            size: new Vec2(32, 48),
            spriteOffset: new Vec2(320, 560),
            price: 1800,
        },
        WINE_TABLE: {
            name: 'Wine Table',
            size: new Vec2(48, 32),
            spriteOffset: new Vec2(672, 448),
            price: 2000, //Invented price
        },
        SPIRITS_TABLE: {
            name: 'Spirits Table',
            size: new Vec2(48, 32),
            spriteOffset: new Vec2(672, 480),
            price: 2000, //Invented price
        },
        DESERT_TABLE: {
            name: 'Desert Table',
            size: new Vec2(32, 48),
            spriteOffset: new Vec2(512, 80),
            price: 1500, //Invented price
        },
        JOJA_TABLE: {
            name: 'Joja Table',
            size: new Vec2(32, 48),
            spriteOffset: new Vec2(896, 464),
            price: 1500, //Invented price
        },
        WIZARD_TABLE: {
            name: 'Wizard Table',
            size: new Vec2(32, 48),
            spriteOffset: new Vec2(640, 1152),
            price: 1500, //Invented price
        },
        JUNIMO_TABLE: {
            name: 'Junimo Table',
            size: new Vec2(32, 48),
            spriteOffset: new Vec2(896, 64),
            price: 1500, //Invented price
        },
        RETRO_TABLE: {
            name: 'Retro Table',
            size: new Vec2(32, 48),
            spriteOffset: new Vec2(672, 880),
            price: 1500, //Invented price
        }
    },
    
    TEA_TABLES: {
        OAK_TEA_TABLE: {
            name: 'Oak Tea Table',
            size: new Vec2(32),
            spriteOffset: new Vec2(0, 608),
            price: 750,
        },
        WALNUT_TEA_TABLE: {
            name: 'Walnut Tea Table',
            size: new Vec2(32),
            spriteOffset: new Vec2(32, 608),
            price: 750,
        },
        BIRCH_TEA_TABLE: {
            name: 'Birch Tea Table',
            size: new Vec2(32),
            spriteOffset: new Vec2(64, 608),
            price: 750,
        },
        MAHOGANY_TEA_TABLE: {
            name: 'Mahogany Tea Table',
            size: new Vec2(32),
            spriteOffset: new Vec2(96, 608),
            price: 1500,
        },
        MODERN_TEA_TABLE: {
            name: 'Modern Tea Table',
            size: new Vec2(32),
            spriteOffset: new Vec2(128, 608),
            price: 1000,
        },
        JOJA_TEA_TABLE: {
            name: 'Joja Tea Table',
            size: new Vec2(32),
            spriteOffset: new Vec2(864, 464),
            price: 1500, //Invented price
        },
        WIZARD_TEA_TABLE: {
            name: 'Wizard Tea Table',
            size: new Vec2(32),
            spriteOffset: new Vec2(688, 1168),
            price: 1500, //Invented price
        },
        JUNIMO_TEA_TABLE: {
            name: 'Junimo Tea Table',
            size: new Vec2(32),
            spriteOffset: new Vec2(864, 112),
            price: 1500, //Invented price
        },
        RETRO_TEA_TABLE: {
            name: 'Retro Tea Table',
            size: new Vec2(32),
            spriteOffset: new Vec2(576, 912),
            price: 1500, //Invented price
        }
    },

    END_TABLES: {
        OAK_END_TABLE: {
            name: 'Oak End Table',
            size: new Vec2(16, 32),
            spriteOffset: new Vec2(240, 688),
            price: 500,
        },
        WALNUT_END_TABLE: {
            name: 'Walnut End Table',
            size: new Vec2(16, 32),
            spriteOffset: new Vec2(272, 688),
            price: 500,
        },
        BIRCH_END_TABLE: {
            name: 'Birch End Table',
            size: new Vec2(16, 32),
            spriteOffset: new Vec2(304, 688),
            price: 500,
        },
        MAHOGANY_END_TABLE: {
            name: 'Mahogany End Table',
            size: new Vec2(16, 32),
            spriteOffset: new Vec2(336, 688),
            price: 1000,
        },
        MODERN_END_TABLE: {
            name: 'Modern End Table',
            size: new Vec2(16, 32),
            spriteOffset: new Vec2(368, 688),
            price: 800,
        },
        WINTER_END_TABLE: {
            name: 'Winter End Table',
            size: new Vec2(16, 32),
            spriteOffset: new Vec2(400, 688),
            price: 800,
        },
        GRANDMOTHER_END_TABLE: {
            name: 'Grandmother End Table',
            size: new Vec2(16, 32),
            spriteOffset: new Vec2(384, 688),
            price: 1000,
        },
        DESERT_END_TABLE: {
            name: 'Desert End Table',
            size: new Vec2(16, 32),
            spriteOffset: new Vec2(544, 112),
            price: 1000, //Invented price
        },
        JOJA_END_TABLE: {
            name: 'Joja End Table',
            size: new Vec2(16, 32),
            spriteOffset: new Vec2(912, 720),
            price: 1000, //Invented price
        },
        GRAY_JOJA_END_TABLE: {
            name: 'Gray Joja End Table',
            size: new Vec2(16, 32),
            spriteOffset: new Vec2(944, 720),
            price: 1000, //Invented price
        },
        WIZARD_END_TABLE: {
            name: 'Wizard End Table',
            size: new Vec2(16, 32),
            spriteOffset: new Vec2(672, 1104),
            price: 1000, //Invented price
        },
        JUNIMO_END_TABLE: {
            name: 'Junimo End Table',
            size: new Vec2(16, 32),
            spriteOffset: new Vec2(816, 112),
            price: 1000, //Invented price
        },
        RETRO_END_TABLE: {
            name: 'Retro End Table',
            size: new Vec2(16, 32),
            spriteOffset: new Vec2(544, 912),
            price: 1000, //Invented price
        }
    },

    COFFE_TABLES: {
        COFFE_TABLE: {
            name: 'Coffe Table',
            size: new Vec2(32),
            spriteOffset: new Vec2(320, 352),
            price: 1250,
        },
        STONE_SLAB: {
            name: 'Stone Table',
            size: new Vec2(32),
            spriteOffset: new Vec2(368, 352),
            price: 1000,
        },
        JOJA_COFFE_TABLE: {
            name: 'Joja Coffe Table',
            size: new Vec2(32),
            spriteOffset: new Vec2(848, 672),
            price: 1250, //Invented price
        },
        GRAY_COFFE_JOJA_TABLE: {
            name: 'Gray Joja Coffe Table',
            size: new Vec2(32),
            spriteOffset: new Vec2(896, 672),
            price: 1250, //Invented price
        },
        ELIXIR_TABLE: {
            name: 'Elixir Table',
            size: new Vec2(32),
            spriteOffset: new Vec2(656, 1200),
            price: 1250, //Invented price
        }
    },

    //Rugs
    RUGS: {
        BAMBOO_MAT: {
            name: 'Bamboo Mat',
            size: new Vec2(32, 16),
            spriteOffset: new Vec2(432, 864),
            sortingLayer: DecorationLayer.RUGS,
            price: 250,
        },
        BURLAP_RUG: {
            name: 'Burlap Rug',
            size: new Vec2(32),
            spriteOffset: new Vec2(224, 864),
            sortingLayer: DecorationLayer.RUGS,
            price: 350,
        },
        WOODCUT_RUG: {
            name: 'Woodcut Rug',
            size: new Vec2(32),
            spriteOffset: new Vec2(272, 880),
            sortingLayer: DecorationLayer.RUGS,
            price: 800,
        },
        MONSTER_RUG: {
            name: 'Monster Rug',
            size: new Vec2(32),
            spriteOffset: new Vec2(448, 800),
            sortingLayer: DecorationLayer.RUGS,
            price: 800, //Invented price
        },
        OCEANIC_RUG: {
            name: 'Oceanic Rug',
            size: new Vec2(48, 32),
            spriteOffset: new Vec2(192, 608),
            sortingLayer: DecorationLayer.RUGS,
            price: 800,
        },
        RED_RUG: {
            name: 'Red Rug',
            size: new Vec2(48, 32),
            spriteOffset: new Vec2(176, 720),
            sortingLayer: DecorationLayer.RUGS,
            price: 1000,
        },
        PATCHWORK_RUG: {
            name: 'Patchwork Rug',
            size: new Vec2(48, 32),
            spriteOffset: new Vec2(256, 720),
            sortingLayer: DecorationLayer.RUGS,
            price: 800,
        },
        DARK_RUG: {
            name: 'Dark Rug',
            size: new Vec2(48, 32),
            spriteOffset: new Vec2(337, 720),
            sortingLayer: DecorationLayer.RUGS,
            price: 2000,
        },
        RED_COTTAGE_RUG: {
            name: 'Red Cottage Rug',
            size: new Vec2(48, 32),
            spriteOffset: new Vec2(288, 800),
            sortingLayer: DecorationLayer.RUGS,
            price: 1250, //Invented price
        },
        GREEN_COTTAGE_RUG: {
            name: 'Green Cottage Rug',
            size: new Vec2(48, 32),
            spriteOffset: new Vec2(368, 800),
            sortingLayer: DecorationLayer.RUGS,
            price: 1250, //Invented price
        },
        MYSTIC_RUG: {
            name: 'Mystic Rug',
            size: new Vec2(48, 32),
            spriteOffset: new Vec2(0, 832),
            sortingLayer: DecorationLayer.RUGS,
            price: 1250, //Invented price
        },
        NAUTICAL_RUG: {
            name: 'Nautical Rug',
            size: new Vec2(48, 32),
            spriteOffset: new Vec2(144, 864),
            sortingLayer: DecorationLayer.RUGS,
            price: 1250,
        },
        PIRATE_RUG: {
            name: 'Pirate Rug',
            size: new Vec2(48, 32),
            spriteOffset: new Vec2(224, 944),
            sortingLayer: DecorationLayer.RUGS,
            price: 1250, //Invented price
        },
        FRUIT_SALAD_RUG: {
            name: 'Fruit Salad Rug',
            size: new Vec2(48, 32),
            spriteOffset: new Vec2(336, 944),
            sortingLayer: DecorationLayer.RUGS,
            price: 1250, //Invented price
        },
        BONE_RUG: {
            name: 'Bone Rug',
            size: new Vec2(48, 32),
            spriteOffset: new Vec2(192, 976),
            sortingLayer: DecorationLayer.RUGS,
            price: 1250, //Invented price
        },
        SNOWY_RUG: {
            name: 'Snowy Rug',
            size: new Vec2(48, 32),
            spriteOffset: new Vec2(416, 976),
            sortingLayer: DecorationLayer.RUGS,
            price: 1250, //Invented price
        },
        LIGHT_GREEN_RUG: {
            name: 'Light Green Rug',
            size: new Vec2(48, 32),
            spriteOffset: new Vec2(385, 1232),
            sortingLayer: DecorationLayer.RUGS,
            price: 1250, //Invented price
        },
        LARGE_GREEN_RUG: {
            name: 'Large Green Rug',
            size: new Vec2(64, 48),
            spriteOffset: new Vec2(0, 1392),
            sortingLayer: DecorationLayer.RUGS,
            price: 2500,
        },
        ICY_RUG: {
            name: 'Icy Rug',
            size: new Vec2(64, 48),
            spriteOffset: new Vec2(96, 1392),
            sortingLayer: DecorationLayer.RUGS,
            price: 4000,
        },
        OLD_WORLD_RUG: {
            name: 'Old World Rug',
            size: new Vec2(64, 48),
            spriteOffset: new Vec2(160, 1392),
            sortingLayer: DecorationLayer.RUGS,
            price: 2500,
        },
        LARGE_RED_RUG: {
            name: 'Large Red Rug',
            size: new Vec2(64, 48),
            spriteOffset: new Vec2(224, 1392),
            sortingLayer: DecorationLayer.RUGS,
            price: 1000,
        },
        LARGE_COTTAGE_RUG: {
            name: 'Large Cottage Rug',
            size: new Vec2(64, 48),
            spriteOffset: new Vec2(288, 1392),
            sortingLayer: DecorationLayer.RUGS,
            price: 2000,
        },
        FUNKY_RUG: {
            name: 'Funky Rug',
            size: new Vec2(80, 64),
            spriteOffset: new Vec2(352, 1424),
            sortingLayer: DecorationLayer.RUGS,
            price: 4000,
        },
        MODERN_RUG: {
            name: 'Modern Rug',
            size: new Vec2(80, 64),
            spriteOffset: new Vec2(432, 1424),
            sortingLayer: DecorationLayer.RUGS,
            price: 4000,
        },
        BLOSSOM_RUG: {
            name: 'Blossom Rug',
            size: new Vec2(96, 64),
            spriteOffset: new Vec2(352, 1360),
            sortingLayer: DecorationLayer.RUGS,
            price: 3500, //Invented price
        },
        SANDY_RUG: {
            name: 'Sandy Rug',
            size: new Vec2(48),
            spriteOffset: new Vec2(624, 80),
            sortingLayer: DecorationLayer.RUGS,
            price: 1250, //Invented price
        },
        DESERT_RUG: {
            name: 'Desert Rug',
            size: new Vec2(64, 48),
            spriteOffset: new Vec2(512, 192),
            sortingLayer: DecorationLayer.RUGS,
            price: 2000, //Invented price
        },
        LARGE_JOJA_RUG: {
            name: 'Large Joja Rug',
            size: new Vec2(80, 48),
            spriteOffset: new Vec2(768, 608),
            sortingLayer: DecorationLayer.RUGS,
            price: 3000, //Invented price
        },
        SQUARE_JOJA_RUG: {
            name: 'Square Joja Rug',
            size: new Vec2(32),
            spriteOffset: new Vec2(848, 624),
            sortingLayer: DecorationLayer.RUGS,
            price: 800, //Invented price
        },
        SMALL_JOJA_RUG: {
            name: 'Small Joja Rug',
            size: new Vec2(32, 16),
            spriteOffset: new Vec2(848, 608),
            sortingLayer: DecorationLayer.RUGS,
            price: 500, //Invented price
        },
        JOJA_RUG: {
            name: 'Joja Rug',
            size: new Vec2(48, 32),
            spriteOffset: new Vec2(768, 656),
            sortingLayer: DecorationLayer.RUGS,
            price: 1250, //Invented price
        },
        RUNE_RUG: {
            name: 'Rune Rug',
            size: new Vec2(32),
            spriteOffset: new Vec2(576, 1248),
            sortingLayer: DecorationLayer.RUGS,
            price: 800, //Invented price
        },
        SWIRL_RUG: {
            name: 'Swirl Rug',
            size: new Vec2(48, 32),
            spriteOffset: new Vec2(512, 1280),
            sortingLayer: DecorationLayer.RUGS,
            price: 1250, //Invented price
        },
        STARRY_MOON_RUG: {
            name: 'Starry Moon Rug',
            size: new Vec2(80, 48),
            spriteOffset: new Vec2(512, 1329),
            sortingLayer: DecorationLayer.RUGS,
            price: 3000, //Invented price
        },
        STONE_FLOORING: {
            name: 'Stone Flooring',
            size: new Vec2(64),
            spriteOffset: new Vec2(512, 1216),
            sortingLayer: DecorationLayer.RUGS,
            price: 2000, //Invented price
        },
        SQUARE_JUNIMO_RUG: {
            name: 'Square Junimo Rug',
            size: new Vec2(32),
            spriteOffset: new Vec2(769, 192),
            sortingLayer: DecorationLayer.RUGS,
            price: 800, //Invented price
        },
        CIRCULAR_JUNIMO_RUG: {
            name: 'Circular Junimo Rug',
            size: new Vec2(48),
            spriteOffset: new Vec2(768, 336),
            sortingLayer: DecorationLayer.RUGS,
            price: 1250, //Invented price
        },
        JUNIMO_RUG: {
            name: 'Junimo Rug',
            size: new Vec2(64, 48),
            spriteOffset: new Vec2(768, 224),
            sortingLayer: DecorationLayer.RUGS,
            price: 2000, //Invented price
        },
        JUNIMO_MAT: {
            name: 'Junimo Mat',
            size: new Vec2(48, 32),
            spriteOffset: new Vec2(832, 224),
            sortingLayer: DecorationLayer.RUGS,
            price: 1250, //Invented price
        },
        SMALL_JUNIMO_MAT: {
            name: 'Small Junimo Mat',
            size: new Vec2(32, 16),
            spriteOffset: new Vec2(928, 368),
            sortingLayer: DecorationLayer.RUGS,
            price: 500, //Invented price
        },
        LARGE_RETRO_RUG: {
            name: 'Large Retro Rug',
            size: new Vec2(64, 48),
            spriteOffset: new Vec2(656, 960),
            sortingLayer: DecorationLayer.RUGS,
            price: 2000, //Invented price
        },
        RETRO_RUG: {
            name: 'Retro Rug',
            size: new Vec2(48, 32),
            spriteOffset: new Vec2(544, 944),
            sortingLayer: DecorationLayer.RUGS,
            price: 1250, //Invented price
        },
        RETRO_SQUARE_RUG: {
            name: 'Retro Square Rug',
            size: new Vec2(32),
            spriteOffset: new Vec2(624, 944),
            sortingLayer: DecorationLayer.RUGS,
            price: 800, //Invented price
        },
        RETRO_MAT: {
            name: 'Retro Mat',
            size: new Vec2(32, 16),
            spriteOffset: new Vec2(624, 976),
            sortingLayer: DecorationLayer.RUGS,
            price: 500, //Invented price
        }
    },

    //Cushions
    CUSHIONS: {
        BLUE_CUSHION: {
            name: 'Blue Cushion',
            size: new Vec2(16),
            spriteOffset: new Vec2(544, 464),
            sortingLayer: DecorationLayer.CUSHIONS,
            price: 350, //Invented price
        },
        YELLOW_CUSHION: {
            name: 'Yellow Cushion',
            size: new Vec2(16),
            spriteOffset: new Vec2(560, 464),
            sortingLayer: DecorationLayer.CUSHIONS,
            price: 350, //Invented price
        },
        GREEN_CUSHION: {
            name: 'Green Cushion',
            size: new Vec2(16),
            spriteOffset: new Vec2(576, 464),
            sortingLayer: DecorationLayer.CUSHIONS,
            price: 350, //Invented price
        },
        RED_CUSHION: {
            name: 'Red Cushion',
            size: new Vec2(16),
            spriteOffset: new Vec2(592, 464),
            sortingLayer: DecorationLayer.CUSHIONS,
            price: 350, //Invented price
        },
        BROWN_CUSHION: {
            name: 'Brown Cushion',
            size: new Vec2(16),
            spriteOffset: new Vec2(608, 464),
            sortingLayer: DecorationLayer.CUSHIONS,
            price: 350, //Invented price
        },
        BLACK_CUSHION: {
            name: 'Black Cushion',
            size: new Vec2(16),
            spriteOffset: new Vec2(624, 464),
            sortingLayer: DecorationLayer.CUSHIONS,
            price: 350, //Invented price
        },
        JOJA_CUSHION: {
            name: 'Joja Cushion',
            size: new Vec2(16),
            spriteOffset: new Vec2(880, 496),
            sortingLayer: DecorationLayer.CUSHIONS,
            price: 500, //Invented price
        },
        GRAY_JOJA_CUSHION: {
            name: 'Gray Joja Cushion',
            size: new Vec2(16),
            spriteOffset: new Vec2(864, 496),
            sortingLayer: DecorationLayer.CUSHIONS,
            price: 500, //Invented price
        },
        WIZARD_CUSHION: {
            name: 'Wizard Cushion',
            size: new Vec2(16),
            spriteOffset: new Vec2(672, 1168),
            sortingLayer: DecorationLayer.CUSHIONS,
            price: 500, //Invented price
        },
        DARK_WIZARD_CUSHION: {
            name: 'Dark Wizard Cushion',
            size: new Vec2(16),
            spriteOffset: new Vec2(672, 1184),
            sortingLayer: DecorationLayer.CUSHIONS,
            price: 500, //Invented price
        },
        JUNIMO_CUSHION: {
            name: 'Junimo Cushion',
            size: new Vec2(16),
            spriteOffset: new Vec2(864, 144),
            sortingLayer: DecorationLayer.CUSHIONS,
            price: 500, //Invented price
        },
        DARK_JUNIMO_CUSHION: {
            name: 'Dark Junimo Cushion',
            size: new Vec2(16),
            spriteOffset: new Vec2(880, 144),
            sortingLayer: DecorationLayer.CUSHIONS,
            price: 500, //Invented price
        },
        RETRO_CUSHION: {
            name: 'Retro Cushion',
            size: new Vec2(16),
            spriteOffset: new Vec2(624, 848),
            sortingLayer: DecorationLayer.CUSHIONS,
            price: 500, //Invented price
        },
        DARK_RETRO_CUSHION: {
            name: 'Dark Retro Cushion',
            size: new Vec2(16),
            spriteOffset: new Vec2(608, 848),
            sortingLayer: DecorationLayer.CUSHIONS,
            price: 500, //Invented price
        }
    },

    //Plants
    HOUSE_PLANTS: {
        HOUSE_PLANT_1: {
            name: 'House Plant 1',
            size: new Vec2(16, 32),
            spriteOffset: new Vec2(0, 688),
            price: 250,
        },
        HOUSE_PLANT_2: {
            name: 'House Plant 2',
            size: new Vec2(16, 32),
            spriteOffset: new Vec2(32, 688),
            price: 250,
        },
        HOUSE_PLANT_3: {
            name: 'House Plant 3',
            size: new Vec2(16, 32),
            spriteOffset: new Vec2(160, 688),
            price: 250,
        },
        HOUSE_PLANT_4: {
            name: 'House Plant 4',
            size: new Vec2(16, 32),
            spriteOffset: new Vec2(144, 688),
            price: 250,
        },
        HOUSE_PLANT_5: {
            name: 'House Plant 5',
            size: new Vec2(16, 32),
            spriteOffset: new Vec2(192, 688),
            price: 250,
        },
        HOUSE_PLANT_6: {
            name: 'House Plant 6',
            size: new Vec2(16, 32),
            spriteOffset: new Vec2(48, 688),
            price: 250,
        },
        HOUSE_PLANT_7: {
            name: 'House Plant 7',
            size: new Vec2(16, 32),
            spriteOffset: new Vec2(224, 688),
            price: 250,
        },
        HOUSE_PLANT_8: {
            name: 'House Plant 8',
            size: new Vec2(16, 32),
            spriteOffset: new Vec2(208, 688),
            price: 250,
        },
        HOUSE_PLANT_9: {
            name: 'House Plant 9',
            size: new Vec2(16, 32),
            spriteOffset: new Vec2(64, 688),
            price: 250,
        },
        HOUSE_PLANT_10: {
            name: 'House Plant 10',
            size: new Vec2(16, 32),
            spriteOffset: new Vec2(16, 688),
            price: 250,
        },
        HOUSE_PLANT_11: {
            name: 'House Plant 11',
            size: new Vec2(16, 32),
            spriteOffset: new Vec2(128, 688),
            price: 250,
        },
        HOUSE_PLANT_12: {
            name: 'House Plant 12',
            size: new Vec2(16, 32),
            spriteOffset: new Vec2(96, 688),
            price: 250,
        },
        HOUSE_PLANT_13: {
            name: 'House Plant 13',
            size: new Vec2(16, 32),
            spriteOffset: new Vec2(80, 688),
            price: 250,
        },
        HOUSE_PLANT_14: {
            name: 'House Plant 14',
            size: new Vec2(16, 32),
            spriteOffset: new Vec2(176, 688),
            price: 250,
        },
        HOUSE_PLANT_15: {
            name: 'House Plant 15',
            size: new Vec2(16, 32),
            spriteOffset: new Vec2(112, 688),
            price: 250,
        }
    },

    //Misc
    LARGE_MISC: {
        STANDING_GEODE: {
            name: 'Standing Geode',
            size: new Vec2(16, 32),
            spriteOffset: new Vec2(288, 640),
            price: 400, //Invented price
        },
        OBSIDIAN_VASE: {
            name: 'Obsidian Vase',
            size: new Vec2(16, 32),
            spriteOffset: new Vec2(304, 640),
            price: 400, //Invented price
        },
        SKELETON_STATUE: {
            name: 'Skeleton Statue',
            size: new Vec2(16, 32),
            spriteOffset: new Vec2(384, 640),
            price: 400, //Invented price
        },
        CHICKEN_STATUE: {
            name: 'Chicken Statue',
            size: new Vec2(16, 32),
            spriteOffset: new Vec2(400, 640),
            price: 400, //Invented price
        },
        LEAHS_STATUE: {
            name: "Leah's Statue",
            size: new Vec2(16, 32),
            spriteOffset: new Vec2(416, 640),
            price: 400, //Invented price
        },
        SAMS_BOOMBOX: {
            name: "Sam's Boombox",
            size: new Vec2(16, 32),
            spriteOffset: new Vec2(464, 640),
            price: 400, //Invented price
        },
        LARGE_FUTAN_BEAR: {
            name: 'Large Futan Bear',
            size: new Vec2(32),
            spriteOffset: new Vec2(80, 832),
            price: 500,
        },
        BEAR_STATUE: {
            name: 'Bear Statue',
            size: new Vec2(32, 64),
            spriteOffset: new Vec2(112, 832),
            price: 500, //Invented price
        },
        JUNIMO_PLUSH: {
            name: 'Junimo Plush',
            size: new Vec2(32),
            spriteOffset: new Vec2(80, 864),
            price: 500, //Invented price
        },
        GOURMAND_STATUE: {
            name: 'Gourmand Statue',
            size: new Vec2(32),
            spriteOffset: new Vec2(448, 1152),
            price: 500, //Invented price
        },
        TRASH_CAN: {
            name: 'Trash Can',
            size: new Vec2(16, 32),
            spriteOffset: new Vec2(432, 1200),
            price: 250,
        },
        COAT_STAND: {
            name: 'Coat Stand',
            size: new Vec2(16, 48),
            spriteOffset: new Vec2(608, 416),
            price: 2000,
        },
        BIRD_HOUSE: {
            name: 'Bird House',
            size: new Vec2(16, 48),
            spriteOffset: new Vec2(624, 416),
            price: 5000,
        },
        ELEGANT_VASE: {
            name: 'Elegant Vase',
            size: new Vec2(16, 32),
            spriteOffset: new Vec2(608, 512),
            price: 400, //Invented price
        },
        CAT_TREE: {
            name: 'Cat Tree',
            size: new Vec2(32, 48),
            spriteOffset: new Vec2(624, 512),
            price: 10000,
        },
        DARK_CAT_TREE: {
            name: 'Dark Cat Tree',
            size: new Vec2(32, 48),
            spriteOffset: new Vec2(656, 512),
            price: 10000,
        },
        BARREL: {
            name: 'Barrel',
            size: new Vec2(16, 32),
            spriteOffset: new Vec2(592, 160),
            price: 400, //Invented price
        }
    },

    SMALL_MISC: {
        BOWL_EMPTY: {
            name: 'Empty Bowl',
            size: new Vec2(16),
            spriteOffset: new Vec2(640, 464),
            price: 100, //Invented price
        },
        BOWL_WATER: {
            name: 'Water Bowl',
            size: new Vec2(16),
            spriteOffset: new Vec2(656, 464),
            price: 100, //Invented price
        },
        FUTAN_BEAR: {
            name: 'Futan Bear',
            size: new Vec2(16),
            spriteOffset: new Vec2(336, 672),
            price: 1500,
        },
        GLOBE: {
            name: 'Globe',
            size: new Vec2(16),
            spriteOffset: new Vec2(352, 672),
            price: 750,
        },
        MODEL_SHIP: {
            name: 'Model Ship',
            size: new Vec2(16),
            spriteOffset: new Vec2(368, 672),
            price: 750,
        },
        SMALL_CRYSTAL: {
            name: 'Small Crystal',
            size: new Vec2(16),
            spriteOffset: new Vec2(384, 672),
            price: 750,
        },
        SMALL_GREEN_JUNIMO_PLUSH: {
            name: 'Small Green Junimo Plush',
            size: new Vec2(16),
            spriteOffset: new Vec2(0, 880),
            price: 500,
        },
        SMALL_BLUE_JUNIMO_PLUSH: {
            name: 'Small Blue Junimo Plush',
            size: new Vec2(16),
            spriteOffset: new Vec2(16, 880),
            price: 500,
        },
        SMALL_YELLOW_JUNIMO_PLUSH: {
            name: 'Small Yellow Junimo Plush',
            size: new Vec2(16),
            spriteOffset: new Vec2(32, 880),
            price: 500,
        },
        SMALL_PINK_JUNIMO_PLUSH: {
            name: 'Small Pink Junimo Plush',
            size: new Vec2(16),
            spriteOffset: new Vec2(48, 880),
            price: 500,
        },
        FUTAN_RABBIT: {
            name: 'Futan Rabbit',
            size: new Vec2(16),
            spriteOffset: new Vec2(64, 880),
            price: 500,
        },
        SQUIRREL_FIGURINE: {
            name: 'Squirrel Figurine',
            size: new Vec2(16),
            spriteOffset: new Vec2(480, 1392),
            price: 500, //Invented price
        },
        RETRO_RADIO: {
            name: 'Retro Radio',
            size: new Vec2(16),
            spriteOffset: new Vec2(656, 912),
            price: 500, //Invented price
        },
        HATCH: {
            name: 'Hatch',
            size: new Vec2(16),
            spriteOffset: new Vec2(704, 400),
            price: 250, //Invented price
        }
    }

}

//Decoration object
export class Decoration extends GameObject {

    //Object
    get isDecoration(): boolean { return true; }

    //Info
    #price: number = 0;

    get price(): number { return this.#price; }

    //Moving
    #snap: number = 16; //Snap grid size
    #moving: boolean = false;
    #movingOffset: Vec2 = new Vec2();

    get moving(): boolean { return this.#moving; }


    //Constructor
    constructor(preset: any = {}, config: any = {}) {
        //Add image to config
        config.image = `decoration.png`;

        //Create game object
        super({ ...preset, ...config });

        //Save price
        if (typeof preset.price === 'number') this.#price = preset.price;

        //Add to decoration list
        Game.decoration.push(this);
    }

    remove() {
        super.remove();

        //Remove from decoration list
        const index = Game.decoration.removeItem(this);

        //Notify decor removed
        Game.vscode.postMessage({
            type: 'remove_decor',
            index: index,
        });

        //Exit decor mode if no decor left
        if (Game.decoration.isEmpty() && Game.isAction(Action.DECOR)) DecorMode.toggle(false);
    }

    //Update
    update() {
        //Update game object
        super.update();

        //Check if moving
        if (!this.#moving || !DecorMode.isAction(DecorAction.MOVE)) return;

        //Calculate new snapped position
        const mousePos = Cursor.posScaled.subtract(this.#movingOffset);
        const snappedPos = this.snapPos(mousePos);

        //Fix bounds
        snappedPos.x = Util.clamp(snappedPos.x, 0, Math.floor((Game.windowSizeScaled.x - this.size.x + this.#snap) / this.#snap) * this.#snap);
        snappedPos.y = Util.clamp(snappedPos.y, 0, Math.floor((Game.windowSizeScaled.y - this.size.y + this.#snap) / this.#snap) * this.#snap);

        //Position didnt change
        if (snappedPos.equals(this.pos)) return;

        //Move to new pos
        this.moveTo(snappedPos, { ignoreWalls: true });

        //Notify position changed
        Game.vscode.postMessage({
            type: 'move_decor',
            index: Game.decoration.indexOf(this),
            x: snappedPos.x,
            y: snappedPos.y
        });
    }

    //Click
    mouseDown(pos: Vec2) {
        //Check game action
        if (!Game.isAction(Action.DECOR)) return false;

        //Check decor action
        switch (DecorMode.action) {
            //Move
            case DecorAction.MOVE:
                //Start moving
                this.startDragging(pos.subtract(this.pos));
                break;

            //Sell
            case DecorAction.SELL:
                //Do nothing
                break;
        }

        //Consume event
        return true;
    }

    mouseUp(pos: Vec2) {
        //Check game action
        if (!Game.isAction(Action.DECOR)) return false;

        //Check decor action
        switch (DecorMode.action) {
            //Move
            case DecorAction.MOVE:
                //Stop moving
                this.stopDragging();
                break;

            //Sell
            case DecorAction.SELL:
                //Give money to player (80%)
                if (typeof this.price === 'number') Game.addMoney(Math.floor(this.price * 0.8));

                //Remove decor
                this.remove();
                break;
        }

        //Consume event
        return true;
    }

    //Movement
    startDragging(moveOffset: Vec2) {
        //Start moving
        this.#moving = true;
        this.#movingOffset = moveOffset;
    }

    stopDragging() {
        //Stop moving
        this.#moving = false;
    }

    snapPos(pos: Vec2) {
        return pos.divide(this.#snap).toIntRound().multiply(this.#snap);
    }

}