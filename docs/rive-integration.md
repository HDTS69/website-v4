# Rive Integration Guide

This guide explains how to use Rive animations in the HD Trade Services website.

## Overview

[Rive](https://rive.app/) is a real-time interactive design and animation tool that allows for creating interactive animations that can be integrated into websites and applications. Unlike standard SVG animations, Rive allows for state-based animations and interactive elements that respond to user input.

## Setup

The necessary packages are already installed in the project:

- `@rive-app/react-canvas`: For React integration

## File Structure

- `/public/rive/`: Directory for Rive animation files (.riv)
- `/components/ui/RiveIcon.tsx`: Reusable component for displaying Rive animations
- `/utils/riveUtils.ts`: Utility functions for working with Rive animations

## Using Rive Icons

### 1. Add Rive Files

Place your `.riv` files in the `/public/rive/` directory. For example:

```
/public/rive/icon-name.riv
```

### 2. Basic Usage

Import and use the `RiveIcon` component:

```tsx
import RiveIcon from '@/components/ui/RiveIcon';

function MyComponent() {
  return (
    <RiveIcon 
      src="/rive/icon-name.riv" 
      width={48} 
      height={48} 
    />
  );
}
```

### 3. With State Machines

If your Rive file contains state machines:

```tsx
<RiveIcon 
  src="/rive/icon-name.riv" 
  stateMachineName="state_machine_name"
  width={48} 
  height={48} 
/>
```

### 4. With Specific Animation

If you want to play a specific animation:

```tsx
<RiveIcon 
  src="/rive/icon-name.riv" 
  animationName="animation_name"
  width={48} 
  height={48} 
/>
```

### 5. Performance Optimization

To improve performance, preload Rive animations:

```tsx
import { preloadRiveAnimations } from '@/utils/riveUtils';

// In your component
useEffect(() => {
  preloadRiveAnimations(['icon1.riv', 'icon2.riv']);
}, []);
```

## Best Practices for Rive Icons

1. **Optimize File Size**: Keep Rive files as small as possible, ideally under 100KB.
2. **Use State Machines**: State machines provide more interactive control than simple animations.
3. **Consistent Sizing**: Maintain consistent icon sizes across your application.
4. **Lazy Loading**: Only load Rive animations when they are needed.
5. **Preload Critical Animations**: Preload animations that are shown immediately on page load.
6. **Responsive Design**: Use relative sizes (%, rem) for responsive layouts.
7. **Fallbacks**: Provide fallback static images for environments where Rive may not work.

## Debugging Rive Animations

If your animations aren't working as expected:

1. Check the browser console for errors
2. Verify that the file path is correct
3. Ensure that the state machine or animation names match those in your Rive file
4. Try opening the .riv file in the Rive app to confirm it's not corrupted

## Creating Rive Animations

To create your own Rive animations:

1. Sign up at [rive.app](https://rive.app/)
2. Create a new file and design your animation
3. Export as a .riv file
4. Add to your project's `/public/rive/` directory

## Resources

- [Rive Documentation](https://help.rive.app/)
- [Rive React Canvas Package](https://www.npmjs.com/package/@rive-app/react-canvas)
- [Rive Examples](https://rive.app/community/) 