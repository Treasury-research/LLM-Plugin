import { CopyIcon } from "@chakra-ui/icons";
import {
	Box,
	useClipboard,
	HStack,
	useBoolean,
	Text,
	Icon,
} from "@chakra-ui/react";
import Editor from "@monaco-editor/react";
import { useEffect, useRef } from "react";
import { BiCopy } from "react-icons/bi";
import { Copy } from "./Copy";

type LineNumbersType =
	| "on"
	| "off"
	| "relative"
	| "interval"
	| ((lineNumber: number) => string);

export const VSEditor = ({
	code,
	language,
	width,
	height,
	readOnly,
	onChange,
	lineNumbers,
	fontSize,
}: {
	code: string;
	language: String;
	width?: string;
	height?: string | number;
	lineNumbers?: LineNumbersType;
	readOnly?: boolean;
	fontSize?: number;
	onChange?: (e: any) => void;
}) => {
	const editorRef = useRef(null);
	const [onlyRead, setOnlyRead] = useBoolean(false);

	const setEditorTheme = (monaco: any) => {
		monaco.editor.defineTheme("light", {
			base: "vs",
			inherit: true,
			rules: [],
			colors: {
				"editor.background": "#dddddd",
			},
		});
	};

	const handleEditorChange = (editor: any, monaco: any) => {
		editorRef.current = editor;
		setOnlyRead.off();
		setTimeout(function () {
			editor.getAction("editor.action.formatDocument")?.run();
		}, 700);
		setTimeout(function () {
			readOnly ? setOnlyRead.on() : setOnlyRead.off();
		}, 700);
	};

	return (
		<Box w={width || "100%"} h={height || "100%"} bg="#dddddd" borderRadius={3}>
			<HStack justify="flex-end" h="32px" px={4} pt={1}>
				<Copy text={code} />
			</HStack>

			<Editor
				width="100%"
				height="100%"
				options={{
					fontSize,
					readOnly: onlyRead,
					wordWrap: "on",
					automaticLayout: true,
					minimap: { enabled: false },
					lineNumbers: lineNumbers ? lineNumbers : "on",
				}}
				onChange={(e) => {
					if (e && onChange) {
						onChange(e);
					} else {
						return;
					}
				}}
				onMount={handleEditorChange}
				beforeMount={setEditorTheme}
				theme="light"
				language={language as string}
				value={code}
			/>
		</Box>
	);
};
