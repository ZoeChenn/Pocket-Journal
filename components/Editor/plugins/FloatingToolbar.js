// import React, { useState, useEffect } from 'react';
// import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
// import { $isRangeSelection, $getSelection, $createParagraphNode, TOGGLE_BOLD_COMMAND, TOGGLE_ITALIC_COMMAND, TOGGLE_UNDERLINE_COMMAND } from 'lexical';

// function FloatingToolbar() {
//   const [editor] = useLexicalComposerContext();
//   const [isVisible, setIsVisible] = useState(false);
//   const [position, setPosition] = useState({ top: 0, left: 0 });

//   useEffect(() => {
//     const unsubscribe = editor.registerUpdateListener(({ editorState }) => {
//       editorState.read(() => {
//         const selection = $getSelection();
//         if ($isRangeSelection(selection) && !selection.isCollapsed()) {
//           const nativeSelection = window.getSelection();
//           const range = nativeSelection.getRangeAt(0);
//           const rect = range.getBoundingClientRect();
  
//           setPosition({
//             top: rect.top + window.scrollY - 120,
//             left: rect.left + window.scrollX - 400,
//           });
  
//           setIsVisible(true);
//         } else {
//           setIsVisible(false);
//         }
//       });
//     });
  
//     return () => {
//       unsubscribe();
//     };
//   }, [editor]);

//   const applyStyle = (command) => {
//     editor.dispatchCommand(command, true);
//   };

//   if (!isVisible) {
//     return null;
//   }

//   return (
//     <div className="floating-toolbar" style={{ top: position.top, left: position.left }}>
//       <button onClick={() => applyStyle(TOGGLE_BOLD_COMMAND)}>Bold</button>
//       <button onClick={() => applyStyle(TOGGLE_ITALIC_COMMAND)}>Italic</button>
//       <button onClick={() => applyStyle(TOGGLE_UNDERLINE_COMMAND)}>Underline</button>
//     </div>
//   );
// }

// export default FloatingToolbar;

import React, { useState, useEffect, useCallback } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  LexicalEditor
} from 'lexical';
import { createPortal } from 'react-dom';

// 辅助函数，用于计算浮动工具栏的位置
function calculatePosition(editor) {
  const nativeSelection = window.getSelection();

  if (nativeSelection && nativeSelection.rangeCount > 0) {
    const range = nativeSelection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    return {
      top: rect.top + window.scrollY - 40, // 40px above the selection
      left: rect.left + window.scrollX + rect.width / 2 // centered above the selection
    };
  }

  return { top: 0, left: 0 };
}

function FloatingTextFormatToolbar() {
  const [editor] = useLexicalComposerContext();
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const updateToolbar = useCallback(() => {
    editor.getEditorState().read(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection) && !selection.isCollapsed()) {
        setPosition(calculatePosition(selection));
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    });
  }, [editor]);

  useEffect(() => {
    return editor.registerUpdateListener(() => {
      updateToolbar();
    });
  }, [editor, updateToolbar]);

  if (!isVisible) {
    return null;
  }

  return createPortal(
    <div className="floating-toolbar" style={{ top: position.top, left: position.left }}>
      <button onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}><i className="format bold" /></button>
      <button onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}>Italic</button>
      <button onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}>Underline</button>
      {/* 其他按钮 */}
    </div>,
    document.body
  );
}

export default FloatingTextFormatToolbar;
