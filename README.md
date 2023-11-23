# Alaska OS

Alaska OS is a web-based operating system designed for a seamless user experience. It combines the power of Next.js, BrowserFS, EmulatorJS, Tailwind CSS, and Mantine UI to deliver a modern and intuitive interface. The aesthetic draws inspiration from the serene landscapes of Alaska, featuring a clean white color scheme with glass effects and accents in shades of blue and black.

## Features

### File Support

Alaska OS accommodates a diverse range of file formats, including images (JPG, JPEG, PNG, GIF), text documents (TXT, MD, RTF), and more.

### Built-in Code Editor

Experience a versatile code editing environment with the Monaco Editor, providing a smooth and efficient coding experience.

### Functional Web Browser

Access the internet seamlessly with the integrated web browser, enhancing the versatility of Alaska OS.

### Advanced Console

The console offers an array of powerful functions, providing users with a robust command-line interface.

### Window Management

Effortlessly manage multiple windows with an intuitive interface, streamlining the organization of different applications.

### EmulatorJS

Alaska OS comes with EmulatorJS, allowing for the emulation of various systems directly within the operating system. By default, Alaska OS includes the Pokemon Fire Red game, providing entertainment directly within the OS environment.

## Interface Features

Explore the capabilities of Alaska OS through these mouse options integrated into the graphical user interface:

-**Copy:** Copy selected files or text.
-**Paste:** Paste copied content.
-**New File:** Create a new file in the current directory.
-**New Folder:** Create a new folder in the current directory.
-**Rename:** Rename a selected file or folder.
-**Download:** Download the selected file.
-**Delete:** Permanently delete the selected file or folder.
-**Refresh:** Refresh the current view.

## Native Softwares

Alaska OS includes a variety of pre-configured software for different applications:

1.**Console**
2.**Explorer**
3.**Browser**
4.**Image Reader**
5.**Pokemon Fire Red**
6.**Calendar** (New)
7.**Music Library** (New)
8.**Video Player** (New)
9.**Calculator** (New)
10.**Classic Paint** (New)
11.**Music Player** (New)
12.**SpreadSheet** (New)
13.**Notepad**
14.**Markdown Editor**
15.**Rich Text Editor**
16.**PDF Reader**
17.**Code Editor**

### Update 0.2.1

Alaska OS has been updated to version 0.2.1 with the addition of the following console commands:

-`count`
-`cat`
-`time`
-`date`
-`head`
-`tail`
-`close`
-`exit`
-`code`

Additionally, the console now supports the following programs:

- Calendar (New)
- Music Library (New)
- Video Player (New)
- Calculator (New)
- Classic Paint (New)
- Music Player (New)
- SpreadSheet (New)

Alaska OS now supports a variety of file types, including:

- Image: JPG, JPEG, PNG, GIF
- Text: TXT, MD, RTF
- Document: PDF
- Audio: MP3
- Video: MP4
- Spreadsheet: XLSX
- Code: JS, JSX, TS, TSX, HTML, CSS
- Markup: MD, XML
- Data: JSON, YAML
- Vector Image: SVG
- Others: ICO, WEBP, AVIF, TIFF, BMP

Note: Some file types are supported but may not have been tested extensively.

Unsupported File Types:

Archive: RAR, 7Z

Audio: WAV

Document: DOC, DOCX, PPT, PPTX

Executable: EXE, APK, ISO, DMG, IMG, NRG

Spreadsheet: XLS

Text: CSV, PY, VB

## **Installation**

To set up Alaska OS locally:

1. Clone the repository:
   <pre><div class="bg-black rounded-md"><div class="flex items-center relative text-gray-200 bg-gray-800 gizmo:dark:bg-token-surface-primary px-4 py-2 text-xs font-sans justify-between rounded-t-md"><span>bash</span><button class="flex ml-auto gizmo:ml-0 gap-1 items-center"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-sm"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 4C10.8954 4 10 4.89543 10 6H14C14 4.89543 13.1046 4 12 4ZM8.53513 4C9.22675 2.8044 10.5194 2 12 2C13.4806 2 14.7733 2.8044 15.4649 4H17C18.6569 4 20 5.34315 20 7V19C20 20.6569 18.6569 22 17 22H7C5.34315 22 4 20.6569 4 19V7C4 5.34315 5.34315 4 7 4H8.53513ZM8 6H7C6.44772 6 6 6.44772 6 7V19C6 19.5523 6.44772 20 7 20H17C17.5523 20 18 19.5523 18 19V7C18 6.44772 17.5523 6 17 6H16C16 7.10457 15.1046 8 14 8H10C8.89543 8 8 7.10457 8 6Z" fill="currentColor"></path></svg>Copy code</button></div><div class="p-4 overflow-y-auto"><code class="!whitespace-pre hljs language-bash">git clone https://github.com/HugoCastroBR/ALASKA-OS.git
   </code></div></div></pre>
2. Install dependencies:
   <pre><div class="bg-black rounded-md"><div class="flex items-center relative text-gray-200 bg-gray-800 gizmo:dark:bg-token-surface-primary px-4 py-2 text-xs font-sans justify-between rounded-t-md"><span>bash</span><button class="flex ml-auto gizmo:ml-0 gap-1 items-center"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-sm"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 4C10.8954 4 10 4.89543 10 6H14C14 4.89543 13.1046 4 12 4ZM8.53513 4C9.22675 2.8044 10.5194 2 12 2C13.4806 2 14.7733 2.8044 15.4649 4H17C18.6569 4 20 5.34315 20 7V19C20 20.6569 18.6569 22 17 22H7C5.34315 22 4 20.6569 4 19V7C4 5.34315 5.34315 4 7 4H8.53513ZM8 6H7C6.44772 6 6 6.44772 6 7V19C6 19.5523 6.44772 20 7 20H17C17.5523 20 18 19.5523 18 19V7C18 6.44772 17.5523 6 17 6H16C16 7.10457 15.1046 8 14 8H10C8.89543 8 8 7.10457 8 6Z" fill="currentColor"></path></svg>Copy code</button></div><div class="p-4 overflow-y-auto"><code class="!whitespace-pre hljs language-bash">cd alaska-os
   npm install
   </code></div></div></pre>
3. Run the development server:
   <pre><div class="bg-black rounded-md"><div class="flex items-center relative text-gray-200 bg-gray-800 gizmo:dark:bg-token-surface-primary px-4 py-2 text-xs font-sans justify-between rounded-t-md"><span>bash</span><button class="flex ml-auto gizmo:ml-0 gap-1 items-center"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-sm"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 4C10.8954 4 10 4.89543 10 6H14C14 4.89543 13.1046 4 12 4ZM8.53513 4C9.22675 2.8044 10.5194 2 12 2C13.4806 2 14.7733 2.8044 15.4649 4H17C18.6569 4 20 5.34315 20 7V19C20 20.6569 18.6569 22 17 22H7C5.34315 22 4 20.6569 4 19V7C4 5.34315 5.34315 4 7 4H8.53513ZM8 6H7C6.44772 6 6 6.44772 6 7V19C6 19.5523 6.44772 20 7 20H17C17.5523 20 18 19.5523 18 19V7C18 6.44772 17.5523 6 17 6H16C16 7.10457 15.1046 8 14 8H10C8.89543 8 8 7.10457 8 6Z" fill="currentColor"></path></svg>Copy code</button></div><div class="p-4 overflow-y-auto"><code class="!whitespace-pre hljs language-bash">npm run dev
   </code></div></div></pre>
4. Access Alaska OS in your browser at [http://localhost:3000](http://localhost:3000/).

## Technologies Used

* Next.js 14
* TypeScript
* Tailwind CSS
* Mantine UI
* BrowserFS
* EmulatorJS
* Monaco Editor
* Redux Toolkit

## Getting Started

Explore the capabilities of Alaska OS by running it locally on your machine. Feel free to contribute, report issues, or suggest improvements. Happy navigating through the beauty of Alaska OS!
