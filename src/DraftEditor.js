import React, { useState, useEffect } from 'react';
import { Editor, EditorState, ContentState, convertToRaw } from 'draft-js';
import 'draft-js/dist/Draft.css';

const DraftEditor = () => {
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const [displayTextList, setDisplayTextList] = useState([]);

  useEffect(() => {
    const savedDisplayTexts = localStorage.getItem('displayTextList');
    if (savedDisplayTexts) {
      const parsedTexts = JSON.parse(savedDisplayTexts);
      setDisplayTextList(parsedTexts);

      const initialContent = parsedTexts.map(text => text.content).join('\n');
      const contentState = ContentState.createFromText(initialContent);
      setEditorState(EditorState.createWithContent(contentState));
    }
  }, []);

  const handleEditorChange = (state) => {
    const contentState = state.getCurrentContent();
    const currentText = contentState.getPlainText();

    setEditorState(state);

    let newDisplayText = null;

    if (currentText === '# ') {
      newDisplayText = { content: 'This is a heading', style: 'heading' };
    } else if (currentText === '* ') {
      newDisplayText = { content: 'This is a bold line', style: 'bold' };
    } else if (currentText === '** ') {
      newDisplayText = { content: 'This is a red line', style: 'red' };
    } else if (currentText === '*** ') {
      newDisplayText = { content: 'This line is underlined', style: 'underline' };
    }

    if (newDisplayText) {
      const newContentState = ContentState.createFromText('');
      setEditorState(EditorState.createWithContent(newContentState));
      setDisplayTextList((prevList) => [...prevList, newDisplayText]);
    }
  };

  const saveToLocalStorage = () => {
    const contentState = editorState.getCurrentContent();
    const rawContent = convertToRaw(contentState);
    localStorage.setItem('editorContent', JSON.stringify(rawContent));
    localStorage.setItem('displayTextList', JSON.stringify(displayTextList));
    alert('Content saved!');
  };

  return (
    <div style={{ maxWidth: '1500px', maxHeight:'3000px', margin: '0 auto', padding: '100px', border: '2px solid #007BFF', borderRadius: '10px', backgroundColor: '#f9f9f9' }}>
      {/* <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Demo editor by Pooja</h2> */}
      <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
  <button onClick={saveToLocalStorage} style={{ padding: '10px 10px', backgroundColor: '#007BFF', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' }}>
    Save
  </button>
</div>
      <Editor
        editorState={editorState}
        onChange={handleEditorChange}
        placeholder="Type here..."
        style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px', minHeight: '200px' }}
      />
      <div style={{ marginTop: '20px', fontWeight: 'bold' }}>
        {displayTextList.map((text, index) => {
          switch (text.style) {
            case 'heading':
              return <h1 key={index} style={{ fontSize: '24px', margin: '10px 0' }}>{text.content}</h1>;
            case 'bold':
              return <h4 key={index} style={{ fontWeight: 'bold', margin: '10px 0' }}>{text.content}</h4>;
            case 'red':
              return <h4 key={index} style={{ color: 'red', margin: '10px 0' }}>{text.content}</h4>;
            case 'underline':
              return <h4 key={index} style={{ textDecoration: 'underline', margin: '10px 0' }}>{text.content}</h4>;
            default:
              return null;
          }
        })}
      </div>
    </div>
  );
};

export default DraftEditor;










/*state.getCurrentContent():

What It Is: state refers to the current state of our editor, which includes all the text and formatting that the user has typed so far.
What It Does: This part of the code calls the function getCurrentContent() on state. This function retrieves the current content of the editor—like pulling out a piece of paper with everything you’ve written on it.
What It Gives You: The result is stored in contentState, which now holds all the information about what you’ve typed, including any formatting (like bold, italic, etc.).
contentState.getPlainText():

What It Is: contentState is like a treasure chest full of your writing. But sometimes, you just want the plain words without any fancy stuff (like colors or styles).
What It Does: By calling getPlainText(), this line takes out all the fancy parts and gives you just the simple words (text) that you wrote.
What It Gives You: The result is stored in currentText, which now contains a simple string of all the words typed in the editor without any formatting. It’s like getting a plain version of your drawing without any colors or decorations.
Why This Is Important
Getting the Right Words: These lines of code help the program know exactly what the user has typed in a simple way. This is important for checking if the user typed something specific, like our magic * to show a title.
Making Decisions: By having the plain text, you can easily check conditions and respond accordingly, like showing a big heading if the user typed the special characters.
*/