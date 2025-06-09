module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  moduleNameMapper: {
    '^react-router-dom$': require.resolve('react-router-dom'),
    '\\.(css|scss|less)$': 'identity-obj-proxy',
  },
};
