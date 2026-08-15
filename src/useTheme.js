import { useContext } from 'react';
import { ThemeContext } from './Themecontext';

export const useTheme = () => useContext(ThemeContext);
