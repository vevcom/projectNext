project('sdl2_image_windows', 'cpp')

cxx = meson.get_compiler('cpp')
sdl2_image_windows_dep = declare_dependency(
  dependencies : [cxx.find_library('SDL2_image', dirs : join_paths(meson.current_source_dir(), 'lib'))],
  include_directories : include_directories(join_paths('include', 'SDL2')))
