const config = {
  plugins: {
    'postcss-import': {},
    'postcss-preset-env': {
      stage: 3,
      features: {
        'css-cascade-layers': true,
      },
    },
  },
}

export default config
