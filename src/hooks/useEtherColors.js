import useTheme from './useTheme'

// Dark = A (Violet Brand) | Light = D (Aqua Sorbet)
export default function useEtherColors() {
  const { theme } = useTheme()
  return theme === 'light'
    ? ['#52E6D9', '#9AD9FF', '#C7C8FF'] // LIGHT (D)
    : ['#5227FF', '#FF9FFC', '#B19EEF'] // DARK (A)
}
