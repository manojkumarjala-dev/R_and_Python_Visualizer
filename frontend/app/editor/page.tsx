'use client'
import React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import Editor from '@monaco-editor/react'
import ClipLoader from "react-spinners/ClipLoader";
import { ChevronDown } from 'lucide-react'

const EditorPage: React.FC = () => {
    const [selectedLanguage, setSelectedLanguage] = React.useState<string>('Python');
    const [outputExtension, setOutputExtension] = React.useState<string>('png');
    const [code, setCode] = React.useState<string>('# Write your Python visualization code here');
    const [output, setOutput] = React.useState<string>('Submit your code to see the output');
    const [loading, setLoading] = React.useState<boolean>(false);
    const [fileUrl, setFileUrl] = React.useState<string | null>(null);
    const [outputType, setOutputType] = React.useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        // console.log(`Selected Language: ${selectedLanguage}`);
        setLoading(true);
        setOutput('');
        // Add your form submission logic here
        console.log(`Code: ${code}`);
        try {
            const response = await fetch("http://localhost:5001/run", {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                language: selectedLanguage.toLowerCase(),
                code: code,
                extention: outputExtension
              })
            })
        
            const result = await response.json()
        
            if (result.error) {
                setFileUrl(null);
                setOutputType(null);
                setLoading(false);
              setOutput(result.error)
            } else if (result.file_url) {
                setFileUrl(`http://127.0.0.1:5001${result.file_url}`);
                setOutputType(result.type);                   
            } else if (result.error) {
              setOutput(result.error)
            }
          } catch (err) {
            console.error(err)
            setOutput("Failed to connect to backend.")
          }
        }
  return (
    <div className="min-h-screen bg-muted pb-30">
      <header className="p-6 text-center text-2xl font-bold bg-black text-white border-b border-gray-800 shadow-md">
        Online Code Visualizer
      </header>

      <main className="max-w-4xl mx-auto p-6">
        <p className=" text-center mb-6">
          Write your Python or R visualization code below. Choose a language, click submit, and see the chart render.
        </p>

        <div className="p-4 rounded-xl border text-sm mb-6 bg-white shadow-sm ">
  <p className="font-semibold text-base mb-2 text-slate">Instructions:</p>
  <ul className="list-disc list-inside space-y-1">
    <li>Select your preferred <span className="font-medium text-black">programming language</span>.</li>
    <li>Choose your desired <span className="font-medium text-black">output format</span> (e.g., <code>png</code>, <code>html</code>).</li>
    <li>Use <code>"__OUTPUT__"</code> as the filename in your code.<br />
      <span className="text-xs text-gray-500">
        Example: <code>plt.savefig("__OUTPUT__")</code> or <code>saveWidget(fig, "__OUTPUT__")</code>
      </span>
    </li>
    <li>Click <span className="font-medium text-black">Generate</span> to render your chart below.</li>
  </ul>
</div>



        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border shadow-md mb-4 w-full transition-all">
  <div className="w-full md:w-1/4">
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
      <Button variant="outline" className="w-full flex items-center">
            {selectedLanguage.toUpperCase()}
            <ChevronDown className="ml-2 h-4 w-4 opacity-70" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Available Languages</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => setSelectedLanguage("Python")}>Python</DropdownMenuItem>
        <DropdownMenuItem onSelect={() => setSelectedLanguage("R")}>R</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>

  <div className="w-full md:w-1/4">
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full flex items-center">
            {outputExtension.toUpperCase()}
            <ChevronDown className="ml-2 h-4 w-4 opacity-70" />
        </Button>
        </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Select Output format</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => setOutputExtension("png")}>static</DropdownMenuItem>
        <DropdownMenuItem onSelect={() => setOutputExtension("html")}>dynamic</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>

  <div className="w-full md:w-1/3">
  <Button
    onClick={handleSubmit}
    className="w-full bg-black text-white transform transition-transform duration-200 hover:scale-105"
  >
    Generate
  </Button>
</div>

</div>



        
      </main>
      <div className="rounded-xl overflow-hidden border border-gray-300 shadow-sm h-full flex mx-5">
  
            {/* Editor Pane */}
            <div className="flex flex-col bg-white p-4 w-1/2 rounded-xl shadow-inner border space-y-4 m-2">
            <h1 className="text-lg font-semibold text-center">Input</h1>
            <div className="border-t border-gray-300 w-full" />
            <Editor
                height="65vh"
                width="100%"
                defaultLanguage={selectedLanguage.toLowerCase()}
                defaultValue={code}
                onChange={(value) => {
                setCode(value || '');
                setOutput('Submit your code to see the output');
                setFileUrl(null);
                setOutputType(null);
                setLoading(false);
                }}
                theme="vs-dark"
                className="rounded-md"
                options={{
                fontSize: 14,
                lineNumbers: 'on',
                renderWhitespace: 'all',
                renderLineHighlight: 'all',
                folding: true,
                formatOnPaste: true,
                tabSize: 4,
                insertSpaces: true,
                }}
            />
            </div>


            {/* Vertical Separator */}
            <div className="w-1 h-auto bg-gray-100" />

            {/* Output Pane */}
            <div className="flex flex-col bg-white p-4 w-1/2 h-[735px] rounded-xl shadow-inner border space-y-4 m-2">
                <h1 className="text-lg font-semibold text-center">Output</h1>
                <div className="border-t border-gray-300 w-full" />

                <div className="flex-1 w-full flex items-center justify-center bg-gray-50 rounded-md overflow-hidden">
                    {fileUrl ? (
                    outputType === "png" || outputType === "jpg" || outputType === "jpeg" ? (
                        <img
                        src={fileUrl}
                        alt="Visualization"
                        className="w-full h-full object-contain rounded-md transition-all duration-300"
                        />
                    ) : (
                        <iframe
                        src={fileUrl}
                        title="Interactive Visualization"
                        className="w-full h-full border-none rounded-md"
                        />
                    )
                    ) : loading ? (
                    <ClipLoader color="#000" size={50} />
                    ) : (
                    <p className="text-sm text-gray-400 text-center">{output}</p>
                    )}
                </div>
            </div>
        </div>

    </div>
  )
}

export default EditorPage
