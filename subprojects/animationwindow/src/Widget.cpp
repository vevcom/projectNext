#include "Widget.h"

void TDT4102::Widget::setCallback(std::function<void(void)> callback) {
    this->callbackFunction = callback;
}

void TDT4102::Widget::fire() {
    if(callbackFunction != nullptr) {
        callbackFunction();
    }
}

TDT4102::Widget::Widget(TDT4102::Point location, unsigned int widgetWidth, unsigned int widgetHeight)
    : position(location), width(widgetWidth), height(widgetHeight) {
    uniqueWidgetName = "widget_" + std::to_string(internal::nextWidgetID);
    internal::nextWidgetID++;
}

void TDT4102::Widget::setVisible(bool visible) {
    isVisible = visible;
}