#pragma once

#include "Widget.h"
#include <string>
#include <vector>

namespace TDT4102 {
    class DropdownList : public TDT4102::Widget {
    private:
        std::vector<std::string> options;
        unsigned int selectedIndex = 0;
    protected:
        void update(nk_context* context) override;
    public:
        explicit DropdownList(TDT4102::Point location, int width, int height, std::vector<std::string> &options);
        std::string getValue();
        void setOptions(std::vector<std::string>& updatedOptionsList);
    };
}