import React, { useRef, useEffect, cloneElement } from "react";

import {
	useASCIIWrapperContext,
	ASCIIWrapperProvider,
} from "./ASCIIWrapperContext";

import { getTextSizeInElement } from "../utils/getSize.js";
import { mergeRefs } from "../utils/mergeRefs.js";
import { strRepeatPattern } from "../utils/strRepeatPattern.js";
import { debounce } from "../utils/debounce.js";

import styles from "./ASCIIWrapper.module.css";

const defaultConfig = {
	verticalPattern: "|",
	horizontalPattern: "-",
	corners: ["+", "+", "+", "+"],
};

const TopBorder = () => {
	const { ASCIIBorders } = useASCIIWrapperContext();

	return ASCIIBorders[0];
};

const BottomBorder = () => {
	const { ASCIIBorders } = useASCIIWrapperContext();

	return ASCIIBorders[1];
};

const ASCIIWrapperComponent = ({
	borderConfig = {},
	border,
	children,
	className,
	bordersClassName,
	delay = 300,
	...rest
}) => {
	const { setASCIIBorders } = useASCIIWrapperContext();
	const innerRef = useRef(null);
	const wrapperRef = useRef(null);
	const ASCIIBorderRef = useRef(null);

	const { verticalPattern, horizontalPattern, corners } = {
		...defaultConfig,
		...borderConfig,
	};

	const updateASCIIInput = () => {
		if (!wrapperRef.current) {
			return;
		}

		const w = wrapperRef.current.offsetWidth;
		const h = wrapperRef.current.offsetHeight;

		const fontSize = getTextSizeInElement("-", ASCIIBorderRef.current);

		if (fontSize.width === 0 || fontSize.height === 0) {
			return;
		}

		const wNum = Math.max(Math.floor(w / fontSize.width) - 2, 0);
		const hNum = Math.max(Math.floor(h / fontSize.height) - 2, 0);

		const topHorizontalStr = `${
			corners[0] + strRepeatPattern(horizontalPattern, wNum) + corners[1]
		}\n`;

		const bottomHorizontalStr = `${
			corners[3] + strRepeatPattern(horizontalPattern, wNum) + corners[2]
		}\n`;

		const verticalBorder = strRepeatPattern(verticalPattern, hNum);
		let bodyStr = "";
		for (const vBorder of verticalBorder) {
			bodyStr += `${vBorder + " ".repeat(wNum) + vBorder}\n`;
		}

		const n = Math.floor(bodyStr.length / 2);
		const top = bodyStr.slice(0, n);
		const bottom = bodyStr.slice(n);

		setASCIIBorders([topHorizontalStr + top, bottom + bottomHorizontalStr]);
	};

	const updateInputSize = () => {
		if (!wrapperRef.current || !innerRef.current) {
			return;
		}

		const w = wrapperRef.current.offsetWidth;
		const h = wrapperRef.current.offsetHeight;
		const fontSize = getTextSizeInElement("-", ASCIIBorderRef.current);
		innerRef.current.style.width = `${w - fontSize.width * 2}px`;
		innerRef.current.style.height = `${h - fontSize.height * 3}px`;
	};

	const updateInput = () => {
		updateASCIIInput();
		updateInputSize();
	};

	const focusInput = (e) => {
		innerRef.current.focus();
		e.stopPropagation();
	};

	useEffect(() => {
		let update = updateInput;
		if (delay !== undefined && delay !== null && delay !== 0) {
			update = debounce(updateInput, delay);
		}
		const resizeObserver = new ResizeObserver((entries, observer) => {
			update();
		});

		updateInput();

		window.addEventListener("resize", update);
		resizeObserver.observe(wrapperRef.current);

		return () => {
			window.removeEventListener("resize", update);
		};
	}, []);

	return (
		<div
			onClick={(e) => {
				focusInput(e);
			}}
			{...rest}
			className={styles.input + " " + className}
			ref={wrapperRef}
		>
			<div
				ref={ASCIIBorderRef}
				className={styles["input-ascii"] + " " + bordersClassName}
			>
				{border ? (
					border
				) : (
					<>
						<TopBorder />
						<BottomBorder />
					</>
				)}
			</div>
			{cloneElement(children, {
				ref: mergeRefs(children.ref, innerRef),
				className: `${styles["input-elem"]} ${children.props.className}`,
			})}
		</div>
	);
};

const ASCIIWrapperWithProvider = (props) => {
	return (
		<ASCIIWrapperProvider>
			<ASCIIWrapperComponent {...props} />
		</ASCIIWrapperProvider>
	);
};

const ASCIIWrapper = Object.assign(ASCIIWrapperWithProvider, {
	TopBorder: TopBorder,
	BottomBorder: BottomBorder,
	useContext: useASCIIWrapperContext,
});

export default ASCIIWrapper;
