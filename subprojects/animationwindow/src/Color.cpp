#include "Color.h"

// This specifies the various predefined colour values
// These are linked, so they can only be specified in a single place, and as such cannot be located inside the header file
const TDT4102::Color TDT4102::Color::transparent = TDT4102::Color(0, 0, 0, 0); 

const TDT4102::Color TDT4102::Color::black = TDT4102::Color{0x000000}; 	
const TDT4102::Color TDT4102::Color::silver = TDT4102::Color{0xc0c0c0}; 	
const TDT4102::Color TDT4102::Color::gray = TDT4102::Color{0x808080}; 	
const TDT4102::Color TDT4102::Color::white = TDT4102::Color{0xffffff}; 	
const TDT4102::Color TDT4102::Color::maroon = TDT4102::Color{0x800000}; 	
const TDT4102::Color TDT4102::Color::red = TDT4102::Color{0xff0000}; 	
const TDT4102::Color TDT4102::Color::purple = TDT4102::Color{0x800080}; 	
const TDT4102::Color TDT4102::Color::fuchsia = TDT4102::Color{0xff00ff}; 	
const TDT4102::Color TDT4102::Color::magenta = TDT4102::Color{0xff00ff}; 	
const TDT4102::Color TDT4102::Color::green = TDT4102::Color{0x008000}; 	
const TDT4102::Color TDT4102::Color::lime = TDT4102::Color{0x00ff00}; 	
const TDT4102::Color TDT4102::Color::olive = TDT4102::Color{0x808000}; 	
const TDT4102::Color TDT4102::Color::yellow = TDT4102::Color{0xffff00}; 	
const TDT4102::Color TDT4102::Color::navy = TDT4102::Color{0x000080}; 	
const TDT4102::Color TDT4102::Color::blue = TDT4102::Color{0x0000ff}; 	
const TDT4102::Color TDT4102::Color::teal = TDT4102::Color{0x008080}; 	
const TDT4102::Color TDT4102::Color::aqua = TDT4102::Color{0x00ffff}; 	
const TDT4102::Color TDT4102::Color::orange = TDT4102::Color{0xffa500}; 	
const TDT4102::Color TDT4102::Color::alice_blue = TDT4102::Color{0xf0f8ff}; 	
const TDT4102::Color TDT4102::Color::antique_white = TDT4102::Color{0xfaebd7}; 	
const TDT4102::Color TDT4102::Color::aquamarine = TDT4102::Color{0x7fffd4}; 	
const TDT4102::Color TDT4102::Color::azure = TDT4102::Color{0xf0ffff}; 	
const TDT4102::Color TDT4102::Color::beige = TDT4102::Color{0xf5f5dc}; 	
const TDT4102::Color TDT4102::Color::bisque = TDT4102::Color{0xffe4c4}; 	
const TDT4102::Color TDT4102::Color::blanched_almond = TDT4102::Color{0xffebcd}; 	
const TDT4102::Color TDT4102::Color::blue_violet = TDT4102::Color{0x8a2be2}; 	
const TDT4102::Color TDT4102::Color::brown = TDT4102::Color{0xa52a2a}; 	
const TDT4102::Color TDT4102::Color::burly_wood = TDT4102::Color{0xdeb887}; 	
const TDT4102::Color TDT4102::Color::cadet_blue = TDT4102::Color{0x5f9ea0}; 	
const TDT4102::Color TDT4102::Color::chart_reuse = TDT4102::Color{0x7fff00}; 	
const TDT4102::Color TDT4102::Color::chocolate = TDT4102::Color{0xd2691e}; 	
const TDT4102::Color TDT4102::Color::coral = TDT4102::Color{0xff7f50}; 	
const TDT4102::Color TDT4102::Color::cornflower_blue = TDT4102::Color{0x6495ed}; 	
const TDT4102::Color TDT4102::Color::corn_silk = TDT4102::Color{0xfff8dc}; 	
const TDT4102::Color TDT4102::Color::crimson = TDT4102::Color{0xdc143c}; 	
const TDT4102::Color TDT4102::Color::cyan = TDT4102::Color{0x00ffff}; 	
const TDT4102::Color TDT4102::Color::dark_blue = TDT4102::Color{0x00008b}; 	
const TDT4102::Color TDT4102::Color::dark_cyan = TDT4102::Color{0x008b8b}; 	
const TDT4102::Color TDT4102::Color::dark_goldenrod = TDT4102::Color{0xb8860b}; 	
const TDT4102::Color TDT4102::Color::dark_gray = TDT4102::Color{0xa9a9a9}; 	
const TDT4102::Color TDT4102::Color::dark_green = TDT4102::Color{0x006400}; 	
const TDT4102::Color TDT4102::Color::dark_grey = TDT4102::Color{0xa9a9a9}; 	
const TDT4102::Color TDT4102::Color::dark_khaki = TDT4102::Color{0xbdb76b}; 	
const TDT4102::Color TDT4102::Color::dark_magenta = TDT4102::Color{0x8b008b}; 	
const TDT4102::Color TDT4102::Color::dark_olivegreen = TDT4102::Color{0x556b2f}; 	
const TDT4102::Color TDT4102::Color::dark_orange = TDT4102::Color{0xff8c00}; 	
const TDT4102::Color TDT4102::Color::dark_orchid = TDT4102::Color{0x9932cc}; 	
const TDT4102::Color TDT4102::Color::dark_red = TDT4102::Color{0x8b0000}; 	
const TDT4102::Color TDT4102::Color::dark_salmon = TDT4102::Color{0xe9967a}; 	
const TDT4102::Color TDT4102::Color::dark_seagreen = TDT4102::Color{0x8fbc8f}; 	
const TDT4102::Color TDT4102::Color::dark_slateblue = TDT4102::Color{0x483d8b}; 	
const TDT4102::Color TDT4102::Color::dark_slategray = TDT4102::Color{0x2f4f4f}; 	
const TDT4102::Color TDT4102::Color::dark_slategrey = TDT4102::Color{0x2f4f4f}; 	
const TDT4102::Color TDT4102::Color::dark_turquoise = TDT4102::Color{0x00ced1}; 	
const TDT4102::Color TDT4102::Color::dark_violet = TDT4102::Color{0x9400d3}; 	
const TDT4102::Color TDT4102::Color::deep_pink = TDT4102::Color{0xff1493}; 	
const TDT4102::Color TDT4102::Color::deep_skyblue = TDT4102::Color{0x00bfff}; 	
const TDT4102::Color TDT4102::Color::dim_gray = TDT4102::Color{0x696969}; 	
const TDT4102::Color TDT4102::Color::dim_grey = TDT4102::Color{0x696969}; 	
const TDT4102::Color TDT4102::Color::dodger_blue = TDT4102::Color{0x1e90ff}; 	
const TDT4102::Color TDT4102::Color::firebrick = TDT4102::Color{0xb22222}; 	
const TDT4102::Color TDT4102::Color::floral_white = TDT4102::Color{0xfffaf0}; 	
const TDT4102::Color TDT4102::Color::forest_green = TDT4102::Color{0x228b22}; 	
const TDT4102::Color TDT4102::Color::gainsboro = TDT4102::Color{0xdcdcdc}; 	
const TDT4102::Color TDT4102::Color::ghost_white = TDT4102::Color{0xf8f8ff}; 	
const TDT4102::Color TDT4102::Color::gold = TDT4102::Color{0xffd700}; 	
const TDT4102::Color TDT4102::Color::goldenrod = TDT4102::Color{0xdaa520}; 	
const TDT4102::Color TDT4102::Color::green_yellow = TDT4102::Color{0xadff2f}; 	
const TDT4102::Color TDT4102::Color::grey = TDT4102::Color{0x808080}; 	
const TDT4102::Color TDT4102::Color::honeydew = TDT4102::Color{0xf0fff0}; 	
const TDT4102::Color TDT4102::Color::hot_pink = TDT4102::Color{0xff69b4}; 	
const TDT4102::Color TDT4102::Color::indian_red = TDT4102::Color{0xcd5c5c}; 	
const TDT4102::Color TDT4102::Color::indigo = TDT4102::Color{0x4b0082}; 	
const TDT4102::Color TDT4102::Color::ivory = TDT4102::Color{0xfffff0}; 	
const TDT4102::Color TDT4102::Color::khaki = TDT4102::Color{0xf0e68c}; 	
const TDT4102::Color TDT4102::Color::lavender = TDT4102::Color{0xe6e6fa}; 	
const TDT4102::Color TDT4102::Color::lavender_blush = TDT4102::Color{0xfff0f5}; 	
const TDT4102::Color TDT4102::Color::lawn_green = TDT4102::Color{0x7cfc00}; 	
const TDT4102::Color TDT4102::Color::lemon_chiffon = TDT4102::Color{0xfffacd}; 	
const TDT4102::Color TDT4102::Color::light_blue = TDT4102::Color{0xadd8e6}; 	
const TDT4102::Color TDT4102::Color::light_coral = TDT4102::Color{0xf08080}; 	
const TDT4102::Color TDT4102::Color::light_cyan = TDT4102::Color{0xe0ffff}; 	
const TDT4102::Color TDT4102::Color::light_goldenrodyellow = TDT4102::Color{0xfafad2}; 	
const TDT4102::Color TDT4102::Color::light_gray = TDT4102::Color{0xd3d3d3}; 	
const TDT4102::Color TDT4102::Color::light_green = TDT4102::Color{0x90ee90}; 	
const TDT4102::Color TDT4102::Color::light_grey = TDT4102::Color{0xd3d3d3}; 	
const TDT4102::Color TDT4102::Color::light_pink = TDT4102::Color{0xffb6c1}; 	
const TDT4102::Color TDT4102::Color::light_salmon = TDT4102::Color{0xffa07a}; 	
const TDT4102::Color TDT4102::Color::light_sea_green = TDT4102::Color{0x20b2aa};
const TDT4102::Color TDT4102::Color::light_sky_blue = TDT4102::Color{0x87cefa};
const TDT4102::Color TDT4102::Color::light_slate_gray = TDT4102::Color{0x778899};
const TDT4102::Color TDT4102::Color::light_slate_grey = TDT4102::Color{0x778899};
const TDT4102::Color TDT4102::Color::light_steel_blue = TDT4102::Color{0xb0c4de};
const TDT4102::Color TDT4102::Color::light_yellow = TDT4102::Color{0xffffe0}; 	
const TDT4102::Color TDT4102::Color::lime_green = TDT4102::Color{0x32cd32}; 	
const TDT4102::Color TDT4102::Color::linen = TDT4102::Color{0xfaf0e6};
const TDT4102::Color TDT4102::Color::medium_aquamarine = TDT4102::Color{0x66cdaa}; 	
const TDT4102::Color TDT4102::Color::medium_blue = TDT4102::Color{0x0000cd}; 	
const TDT4102::Color TDT4102::Color::medium_orchid = TDT4102::Color{0xba55d3}; 	
const TDT4102::Color TDT4102::Color::medium_purple = TDT4102::Color{0x9370db}; 	
const TDT4102::Color TDT4102::Color::medium_sea_green = TDT4102::Color{0x3cb371};
const TDT4102::Color TDT4102::Color::medium_slate_blue = TDT4102::Color{0x7b68ee};
const TDT4102::Color TDT4102::Color::medium_spring_green = TDT4102::Color{0x00fa9a};
const TDT4102::Color TDT4102::Color::medium_turquoise = TDT4102::Color{0x48d1cc}; 	
const TDT4102::Color TDT4102::Color::medium_violet_red = TDT4102::Color{0xc71585};
const TDT4102::Color TDT4102::Color::midnight_blue = TDT4102::Color{0x191970}; 	
const TDT4102::Color TDT4102::Color::mint_cream = TDT4102::Color{0xf5fffa}; 	
const TDT4102::Color TDT4102::Color::misty_rose = TDT4102::Color{0xffe4e1}; 	
const TDT4102::Color TDT4102::Color::moccasin = TDT4102::Color{0xffe4b5}; 	
const TDT4102::Color TDT4102::Color::navajo_white = TDT4102::Color{0xffdead}; 	
const TDT4102::Color TDT4102::Color::old_lace = TDT4102::Color{0xfdf5e6}; 	
const TDT4102::Color TDT4102::Color::olivedrab = TDT4102::Color{0x6b8e23}; 	
const TDT4102::Color TDT4102::Color::orange_red = TDT4102::Color{0xff4500}; 	
const TDT4102::Color TDT4102::Color::orchid = TDT4102::Color{0xda70d6}; 	
const TDT4102::Color TDT4102::Color::pale_goldenrod = TDT4102::Color{0xeee8aa}; 	
const TDT4102::Color TDT4102::Color::pale_green = TDT4102::Color{0x98fb98}; 	
const TDT4102::Color TDT4102::Color::pale_turquoise = TDT4102::Color{0xafeeee}; 	
const TDT4102::Color TDT4102::Color::pale_violet_red = TDT4102::Color{0xdb7093};
const TDT4102::Color TDT4102::Color::papayawhip = TDT4102::Color{0xffefd5}; 	
const TDT4102::Color TDT4102::Color::peachpuff = TDT4102::Color{0xffdab9}; 	
const TDT4102::Color TDT4102::Color::peru = TDT4102::Color{0xcd853f}; 	
const TDT4102::Color TDT4102::Color::pink = TDT4102::Color{0xffc0cb}; 	
const TDT4102::Color TDT4102::Color::plum = TDT4102::Color{0xdda0dd}; 	
const TDT4102::Color TDT4102::Color::powder_blue = TDT4102::Color{0xb0e0e6}; 	
const TDT4102::Color TDT4102::Color::rosy_brown = TDT4102::Color{0xbc8f8f}; 	
const TDT4102::Color TDT4102::Color::royal_blue = TDT4102::Color{0x4169e1}; 	
const TDT4102::Color TDT4102::Color::saddle_brown = TDT4102::Color{0x8b4513}; 	
const TDT4102::Color TDT4102::Color::salmon = TDT4102::Color{0xfa8072}; 	
const TDT4102::Color TDT4102::Color::sandy_brown = TDT4102::Color{0xf4a460}; 	
const TDT4102::Color TDT4102::Color::sea_green = TDT4102::Color{0x2e8b57}; 	
const TDT4102::Color TDT4102::Color::sea_shell = TDT4102::Color{0xfff5ee}; 	
const TDT4102::Color TDT4102::Color::sienna = TDT4102::Color{0xa0522d}; 	
const TDT4102::Color TDT4102::Color::sky_blue = TDT4102::Color{0x87ceeb}; 	
const TDT4102::Color TDT4102::Color::slate_blue = TDT4102::Color{0x6a5acd}; 	
const TDT4102::Color TDT4102::Color::slate_gray = TDT4102::Color{0x708090}; 	
const TDT4102::Color TDT4102::Color::slate_grey = TDT4102::Color{0x708090}; 	
const TDT4102::Color TDT4102::Color::snow = TDT4102::Color{0xfffafa}; 	
const TDT4102::Color TDT4102::Color::spring_green = TDT4102::Color{0x00ff7f}; 	
const TDT4102::Color TDT4102::Color::steel_blue = TDT4102::Color{0x4682b4}; 	
const TDT4102::Color TDT4102::Color::tan = TDT4102::Color{0xd2b48c}; 	
const TDT4102::Color TDT4102::Color::thistle = TDT4102::Color{0xd8bfd8}; 	
const TDT4102::Color TDT4102::Color::tomato = TDT4102::Color{0xff6347}; 	
const TDT4102::Color TDT4102::Color::turquoise = TDT4102::Color{0x40e0d0}; 	
const TDT4102::Color TDT4102::Color::violet = TDT4102::Color{0xee82ee}; 	
const TDT4102::Color TDT4102::Color::wheat = TDT4102::Color{0xf5deb3}; 	
const TDT4102::Color TDT4102::Color::white_smoke = TDT4102::Color{0xf5f5f5}; 	
const TDT4102::Color TDT4102::Color::yellow_green = TDT4102::Color{0x9acd32}; 	
const TDT4102::Color TDT4102::Color::rebecca_purple = TDT4102::Color{0x663399};

TDT4102::Color::Color(unsigned char redChannelValue, unsigned char greenChannelValue, unsigned char blueChannelValue, unsigned char transparencyValue) 
: redChannel{redChannelValue}, 
  greenChannel{greenChannelValue}, 
  blueChannel{blueChannelValue}, 
  alphaChannel{transparencyValue} {}

TDT4102::Color::Color(unsigned int hexadecimalColour) {
      // You do NOT need to understand what is going on here =)
      // This function has a lot of bit magic that is DEFINITELY not in the syllabus
      // This is not a "correct" implementation of a function such as this, but it allows you to paste in
      // a hex colour directly from a colour picker without having to account for the alpha channel.
      // This would cause the transparency to be zero
      unsigned int hexColour = hexadecimalColour;
      if(hexColour <= 0x00FFFFFF) {
          // The blue, green, and alpha channels will have been specified.
          // We move these 3 8-bit channels to the left by 8 bits, which means they become the
          // Red, green, and blue channels.
          hexColour = hexColour << 8;
          // Make the colour opaque by setting the transparency channel to 255
          hexColour |= 0xFF;
      }
    
      // Doing some bitwise magic to separate the 32-bit colour value into 4 separate 8-bit colour channels
      redChannel = (hexColour >> 24) & 0xFF;
      greenChannel = (hexColour >> 16) & 0xFF;
      blueChannel = (hexColour >> 8) & 0xFF;
      alphaChannel = (hexColour >> 0) & 0xFF;
}

bool TDT4102::Color::operator!= (Color otherColor) {
  return 
    (otherColor.redChannel != redChannel) ||
    (otherColor.greenChannel != greenChannel) ||
    (otherColor.blueChannel != blueChannel) ||
    (otherColor.alphaChannel != alphaChannel);
}

bool TDT4102::Color::operator== (Color otherColor) {
  return 
    (otherColor.redChannel == redChannel) &&
    (otherColor.greenChannel == greenChannel) &&
    (otherColor.blueChannel == blueChannel) &&
    (otherColor.alphaChannel == alphaChannel);
}