export const theme = {
    cursorIdle: '#ffffffff',
    cursorDragging: '#f5f5f5ff', 
    overlayColor: '#959595ff',
    overlayOpacity: '0.2'
};

export const generateScrollContainerStyles = (
  isMobile: boolean,
) => {
  const createCursor = (color: string, opacity: string) => 
    `url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48' fill='none'%3E%3Ccircle cx='24' cy='24' r='22' fill='%23000000' fill-opacity='${opacity}' stroke='%23${color.replace('#', '')}' stroke-width='2'/%3E%3Cpath d='M14 24l6-6m-6 6l6 6m-6-6h20m-6-6l6 6m-6 6l6-6' stroke='%23${color.replace('#', '')}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") 24 24`;

  return `
    .scroll-container {
      cursor: ${isMobile ? "default" : `${createCursor(theme.cursorIdle, '0.8')}, grab`};
      scrollbar-width: none;
      -ms-overflow-style: none;
    }
    
    .scroll-container::-webkit-scrollbar {
      display: none;
    }
    
    .scroll-container.dragging,
    .scroll-container.dragging * {
      cursor: ${isMobile ? "default" : `${createCursor(theme.cursorDragging, '0.95')}, grabbing`} !important;
      user-select: none !important;
      -webkit-user-select: none !important;
      -moz-user-select: none !important;
      -ms-user-select: none !important;
    }
    
    .scroll-container * {
      cursor: inherit !important;
    }
    
    /* Blokuj zaznaczanie podczas drag */
    .scroll-container,
    .scroll-container * {
      user-select: none !important;
      -webkit-user-select: none !important;
      -moz-user-select: none !important;
      -ms-user-select: none !important;
    }
    
    /* Mobile optimizations */
    @media (max-width: 768px) {
      .scroll-container {
        overflow-x: auto;
        scroll-behavior: smooth;
        -webkit-overflow-scrolling: touch;
      }
    }
    
    /* Smooth animations */
    .scroll-item {
      transition: transform 0.3s ease-out, filter 0.3s ease-out;
    }
    
    .scroll-item:hover {
      transform: translateY(-8px) scale(1.02);
    }
    
    @media (max-width: 768px) {
      .scroll-item:hover {
        transform: none;
      }
    }
  `;
};