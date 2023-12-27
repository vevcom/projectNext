#pragma once

namespace TDT4102 {
	struct Color {
        // Colour channel fields
        unsigned char redChannel = 0;
        unsigned char greenChannel = 0;
        unsigned char blueChannel = 0;
        unsigned char alphaChannel = 255; // The alpha channel is used for transparency

        // The easiest way of using this colour class is to use one of the default colours specified above
        // However, you can also specify your own if you so desire. We recommend you use a colour picker for finding the colour you want
        // Many colour picker tools allow you to view values for the red, green, and blue channels, or produce a string of 6 numbers and letters (A to F).
        // Use the first constructor for the former format, where each value must be between 0 and 255
        // You can also specify a transparency value in the same range if you want, where 0 means completely transparent, and 255 means completely opaque
        // If your colour picker produces a 6 character hexadecimal string, use the second constructor instead.

        explicit Color(unsigned char red, unsigned char green, unsigned char blue, unsigned char transparency = 255);
        explicit Color(unsigned int hexadecimalColour);
        explicit Color() = default;

        bool operator!=(Color otherColor);
        bool operator==(Color otherColor);

        // Predefined colour values
        // The first set originates from the Graph_lib library used in the course book
		const static Color transparent;
        const static Color red;
        const static Color blue;
        const static Color green;
        const static Color yellow;
        const static Color white;
        const static Color black;
        const static Color magenta;
        const static Color cyan;
        const static Color dark_red;
        const static Color dark_green;
        const static Color dark_blue;
        const static Color dark_magenta;
        const static Color dark_cyan;
            //const static Color gray;
        const static Color mid_gray;
        const static Color dark_gray;
        const static Color light_gray;

        // A second set of colours used from colours used in CSS (intended for web pages)
        // You can find the colour visualised here: https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/color_keywords
        const static Color silver;
        const static Color gray;
        const static Color maroon;
        const static Color purple;
        const static Color fuchsia;
        const static Color lime;
        const static Color olive;
        const static Color navy;
        const static Color teal;
        const static Color aqua;
        const static Color orange;
        const static Color alice_blue;
        const static Color antique_white;
        const static Color aquamarine;
        const static Color azure;
        const static Color beige;
        const static Color bisque;
        const static Color blanched_almond;
        const static Color blue_violet;
        const static Color brown;
        const static Color burly_wood;
        const static Color cadet_blue;
        const static Color chart_reuse;
        const static Color chocolate;
        const static Color coral;
        const static Color cornflower_blue;
        const static Color corn_silk;
        const static Color crimson;
        const static Color dark_goldenrod;
        const static Color dark_grey;
        const static Color dark_khaki;
        const static Color dark_olivegreen;
        const static Color dark_orange;
        const static Color dark_orchid;
        const static Color dark_salmon;
        const static Color dark_seagreen;
        const static Color dark_slateblue;
        const static Color dark_slategray;
        const static Color dark_slategrey;
        const static Color dark_turquoise;
        const static Color dark_violet;
        const static Color deep_pink;
        const static Color deep_skyblue;
        const static Color dim_gray;
        const static Color dim_grey;
        const static Color dodger_blue;
        const static Color firebrick;
        const static Color floral_white;
        const static Color forest_green;
        const static Color gainsboro;
        const static Color ghost_white;
        const static Color gold;
        const static Color goldenrod;
        const static Color green_yellow;
        const static Color grey;
        const static Color honeydew;
        const static Color hot_pink;
        const static Color indian_red;
        const static Color indigo;
        const static Color ivory;
        const static Color khaki;
        const static Color lavender;
        const static Color lavender_blush;
        const static Color lawn_green;
        const static Color lemon_chiffon;
        const static Color light_blue;
        const static Color light_coral;
        const static Color light_cyan;
        const static Color light_goldenrodyellow;
        const static Color light_green;
        const static Color light_grey;
        const static Color light_pink;
        const static Color light_salmon;
        const static Color light_sea_green;
        const static Color light_sky_blue;
        const static Color light_slate_gray;
        const static Color light_slate_grey;
        const static Color light_steel_blue;
        const static Color light_yellow;
        const static Color lime_green;
        const static Color linen;
        const static Color medium_aquamarine;
        const static Color medium_blue;
        const static Color medium_orchid;
        const static Color medium_purple;
        const static Color medium_sea_green;
        const static Color medium_slate_blue;
        const static Color medium_spring_green;
        const static Color medium_turquoise;
        const static Color medium_violet_red;
        const static Color midnight_blue;
        const static Color mint_cream;
        const static Color misty_rose;
        const static Color moccasin;
        const static Color navajo_white;
        const static Color old_lace;
        const static Color olivedrab;
        const static Color orange_red;
        const static Color orchid;
        const static Color pale_goldenrod;
        const static Color pale_green;
        const static Color pale_turquoise;
        const static Color pale_violet_red;
        const static Color papayawhip;
        const static Color peachpuff;
        const static Color peru;
        const static Color pink;
        const static Color plum;
        const static Color powder_blue;
        const static Color rosy_brown;
        const static Color royal_blue;
        const static Color saddle_brown;
        const static Color salmon;
        const static Color sandy_brown;
        const static Color sea_green;
        const static Color sea_shell;
        const static Color sienna;
        const static Color sky_blue;
        const static Color slate_blue;
        const static Color slate_gray;
        const static Color slate_grey;
        const static Color snow;
        const static Color spring_green;
        const static Color steel_blue;
        const static Color tan;
        const static Color thistle;
        const static Color tomato;
        const static Color turquoise;
        const static Color violet;
        const static Color wheat;
        const static Color white_smoke;
        const static Color yellow_green;
        const static Color rebecca_purple;
	};
}

