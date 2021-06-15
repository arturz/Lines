#!/bin/bash

react-native start &
emulator -avd Tablet_10 &
emulator -avd Copy_of_Pixel_2_XL_API_30 &
react-native run-android