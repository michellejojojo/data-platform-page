import React from 'react';
import { LogoTypeUnitSingle } from "./LogoTypeUnitSingle";
import {
	path_D_reverse,
	path_a,
	path_t,
	path_r,
	path_i,
	path_v,
	path_e,
	path_g,
	path_n,
	path_s,
	path_o,
	path_u_2,
	path_o_filled,
	path_u_serif,
	path_B_geometric,
	path_L,
} from "../../../data/logoTypePathData";

export const D = ({
	startDelay = 0,
	delay = 0,
	scale = 1,
	isReverse,
	pathClassName,
	color,
	duration = 600,
	ease,
	isTrigger = true,
	enableGradientAnimation = false,
	gradientColors = ["#FFFFFF", "#000000", "#FFFFFF"],
	gradientAnimationDuration = 1000,
}) => {
	return (
		<LogoTypeUnitSingle
			data={path_D_reverse}
			strokeWidth={72}
			delay={delay}
			startDelay={startDelay}
			scale={scale}
			pathClassName={pathClassName}
			isReverse={isReverse}
			startWithReserve
			color={color}
			isTrigger={isTrigger}
			duration={duration}
			enableGradientAnimation={enableGradientAnimation}
			gradientColors={gradientColors}
			gradientAnimationDuration={gradientAnimationDuration}
			ease={ease}
		/>
	);
};

export const A = ({
	startDelay = 0,
	delay = 0,
	scale = 1,
	isReverse,
	color,
	duration = 600,
	ease,
	isTrigger = true,
	enableGradientAnimation = false,
	gradientColors = ["#FFFFFF", "#000000", "#FFFFFF"],
	gradientAnimationDuration = 1000,
}) => {
	return (
		<LogoTypeUnitSingle
			data={path_a}
			strokeWidth={48}
			delay={delay}
			startDelay={startDelay}
			scale={scale}
			isReverse={isReverse}
			startWithReserve
			color={color}
			isTrigger={isTrigger}
			duration={duration}
			ease={ease}
			enableGradientAnimation={enableGradientAnimation}
			gradientColors={gradientColors}
			gradientAnimationDuration={gradientAnimationDuration}
		/>
	);
};

export const T = ({
	startDelay = 0,
	delay = 0,
	scale = 1,
	color,
	duration = 600,
	ease,
	isTrigger = true,
	enableGradientAnimation = false,
	gradientColors = ["#FFFFFF", "#000000", "#FFFFFF"],
	gradientAnimationDuration = 1000,
}) => {
	return (
		<LogoTypeUnitSingle
			data={path_t}
			width={96}
			strokeWidth={48}
			delay={delay}
			startDelay={startDelay}
			scale={scale}
			color={color}
			isTrigger={isTrigger}
			duration={duration}
			ease={ease}
			enableGradientAnimation={enableGradientAnimation}
			gradientColors={gradientColors}
			gradientAnimationDuration={gradientAnimationDuration}
		/>
	);
};

export const TS = ({
	startDelay = 0,
	delay = 0,
	scale = 1,
	color,
	duration = 600,
	ease,
	isTrigger = true,
	enableGradientAnimation = false,
	gradientColors = ["#FFFFFF", "#000000", "#FFFFFF"],
	gradientAnimationDuration = 1000,
}) => {
	return (
		<LogoTypeUnitSingle
			data={path_t}
			width={80}
			strokeWidth={48}
			delay={delay}
			startDelay={startDelay}
			scale={scale}
			startWithReserve
			color={color}
			isTrigger={isTrigger}
			duration={duration}
			ease={ease}
			enableGradientAnimation={enableGradientAnimation}
			gradientColors={gradientColors}
			gradientAnimationDuration={gradientAnimationDuration}
		/>
	);
};

export const R = ({
	startDelay = 0,
	delay = 0,
	scale = 1,
	isReverse,
	color,
	duration = 600,
	ease,
	isTrigger = true,
	enableGradientAnimation = false,
	gradientColors = ["#FFFFFF", "#000000", "#FFFFFF"],
	gradientAnimationDuration = 1000,
}) => {
	return (
		<LogoTypeUnitSingle
			data={path_r}
			delay={delay}
			startDelay={startDelay}
			width={80}
			strokeWidth={48}
			scale={scale}
			isReverse={isReverse}
			startWithReserve
			color={color}
			isTrigger={isTrigger}
			duration={duration}
			ease={ease}
			enableGradientAnimation={enableGradientAnimation}
			gradientColors={gradientColors}
			gradientAnimationDuration={gradientAnimationDuration}
		/>
	);
};

export const I = ({
	startDelay = 0,
	delay = 0,
	scale = 1,
	isReverse,
	color,
	duration = 600,
	ease,
	isTrigger = true,
	enableGradientAnimation = false,
	gradientColors = ["#FFFFFF", "#000000", "#FFFFFF"],
	gradientAnimationDuration = 1000,
}) => {
	return (
		<LogoTypeUnitSingle
			data={path_i}
			width={48}
			strokeWidth={48}
			delay={delay}
			startDelay={startDelay}
			scale={scale}
			isReverse={isReverse}
			startWithReserve
			color={color}
			isTrigger={isTrigger}
			duration={duration}
			ease={ease}
			enableGradientAnimation={enableGradientAnimation}
			gradientColors={gradientColors}
			gradientAnimationDuration={gradientAnimationDuration}
		/>
	);
};

export const V = ({
	startDelay = 0,
	delay = 0,
	scale = 1,
	isReverse,
	color,
	duration = 600,
	ease,
	isTrigger = true,
	enableGradientAnimation = false,
	gradientColors = ["#FFFFFF", "#000000", "#FFFFFF"],
	gradientAnimationDuration = 1000,
}) => {
	return (
		<LogoTypeUnitSingle
			data={path_v}
			width={144}
			strokeWidth={44}
			delay={delay}
			startDelay={startDelay}
			scale={scale}
			isReverse={isReverse}
			startWithReserve
			color={color}
			isTrigger={isTrigger}
			duration={duration}
			ease={ease}
			enableGradientAnimation={enableGradientAnimation}
			gradientColors={gradientColors}
			gradientAnimationDuration={gradientAnimationDuration}
		/>
	);
};

export const E = ({
	startDelay = 0,
	delay = 0,
	scale = 1,
	isReverse,
	color,
	duration = 600,
	ease,
	isTrigger = true,
	enableGradientAnimation = false,
	gradientColors = ["#FFFFFF", "#000000", "#FFFFFF"],
	gradientAnimationDuration = 1000,
}) => {
	return (
		<LogoTypeUnitSingle
			data={path_e}
			width={144}
			strokeWidth={40}
			delay={delay}
			startDelay={startDelay}
			scale={scale}
			isReverse={isReverse}
			startWithReserve
			color={color}
			isTrigger={isTrigger}
			duration={duration}
			ease={ease}
			enableGradientAnimation={enableGradientAnimation}
			gradientColors={gradientColors}
			gradientAnimationDuration={gradientAnimationDuration}
		/>
	);
};

export const G = ({
	startDelay = 0,
	delay = 0,
	scale = 1,
	isReverse,
	color,
	duration = 600,
	ease,
	isTrigger = true,
	enableGradientAnimation = false,
	gradientColors = ["#FFFFFF", "#000000", "#FFFFFF"],
	gradientAnimationDuration = 1000,
}) => {
	return (
		<LogoTypeUnitSingle
			data={path_g}
			width={144}
			strokeWidth={40}
			delay={delay}
			startDelay={startDelay}
			scale={scale}
			isReverse={isReverse}
			startWithReserve
			color={color}
			isTrigger={isTrigger}
			duration={duration}
			ease={ease}
			enableGradientAnimation={enableGradientAnimation}
			gradientColors={gradientColors}
			gradientAnimationDuration={gradientAnimationDuration}
		/>
	);
};

export const N = ({
	startDelay = 0,
	delay = 0,
	scale = 1,
	isReverse,
	color,
	duration = 600,
	ease,
	isTrigger = true,
	enableGradientAnimation = false,
	gradientColors = ["#FFFFFF", "#000000", "#FFFFFF"],
	gradientAnimationDuration = 1000,
}) => {
	return (
		<LogoTypeUnitSingle
			data={path_n}
			width={144}
			strokeWidth={56}
			delay={delay}
			startDelay={startDelay}
			scale={scale}
			isReverse={isReverse}
			startWithReserve
			color={color}
			isTrigger={isTrigger}
			duration={duration}
			ease={ease}
			enableGradientAnimation={enableGradientAnimation}
			gradientColors={gradientColors}
			gradientAnimationDuration={gradientAnimationDuration}
		/>
	);
};

export const S = ({
	startDelay = 0,
	delay = 0,
	scale = 1,
	isReverse,
	pathClassName,
	color,
	duration = 600,
	ease,
	isTrigger = true,
	enableGradientAnimation = false,
	gradientColors = ["#FFFFFF", "#000000", "#FFFFFF"],
	gradientAnimationDuration = 1000,
}) => {
	return (
		<LogoTypeUnitSingle
			data={path_s}
			width={144}
			strokeWidth={48}
			delay={delay}
			startDelay={startDelay}
			scale={scale}
			isReverse={isReverse}
			startWithReserve
			pathClassName={pathClassName}
			color={color}
			isTrigger={isTrigger}
			duration={duration}
			ease={ease}
			enableGradientAnimation={enableGradientAnimation}
			gradientColors={gradientColors}
			gradientAnimationDuration={gradientAnimationDuration}
		/>
	);
};

export const O = ({
	startDelay = 0,
	delay = 0,
	scale = 1,
	isReverse,
	pathClassName,
	color,
	duration = 600,
	ease,
	isTrigger = true,
	enableGradientAnimation = false,
	gradientColors = ["#FFFFFF", "#000000", "#FFFFFF"],
	gradientAnimationDuration = 1000,
}) => {
	return (
		<LogoTypeUnitSingle
			data={path_o}
			width={144}
			strokeWidth={48}
			delay={delay}
			startDelay={startDelay}
			scale={scale}
			isReverse={isReverse}
			startWithReserve
			pathClassName={pathClassName}
			color={color}
			isTrigger={isTrigger}
			duration={duration}
			ease={ease}
			enableGradientAnimation={enableGradientAnimation}
			gradientColors={gradientColors}
			gradientAnimationDuration={gradientAnimationDuration}
		/>
	);
};

export const O2 = ({
	startDelay = 0,
	delay = 0,
	scale = 1,
	isReverse,
	pathClassName,
	color,
	duration = 600,
	ease,
	isTrigger = true,
	enableGradientAnimation = false,
	gradientColors = ["#FFFFFF", "#000000", "#FFFFFF"],
	gradientAnimationDuration = 1000,
}) => {
	return (
		<LogoTypeUnitSingle
			data={path_o_filled}
			width={144}
			strokeWidth={72}
			delay={delay}
			startDelay={startDelay}
			scale={scale}
			isReverse={isReverse}
			startWithReserve
			pathClassName={pathClassName}
			color={color}
			isTrigger={isTrigger}
			duration={duration}
			ease={ease}
			enableGradientAnimation={enableGradientAnimation}
			gradientColors={gradientColors}
			gradientAnimationDuration={gradientAnimationDuration}
		/>
	);
};

export const U = ({
	startDelay = 0,
	delay = 0,
	scale = 1,
	isReverse,
	pathClassName,
	color,
	duration = 600,
	ease,
	isTrigger = true,
	enableGradientAnimation = false,
	gradientColors = ["#FFFFFF", "#000000", "#FFFFFF"],
	gradientAnimationDuration = 1000,
}) => {
	return (
		<LogoTypeUnitSingle
			data={path_u_serif}
			width={144}
			strokeWidth={48}
			delay={delay}
			startDelay={startDelay}
			scale={scale}
			isReverse={isReverse}
			startWithReserve
			pathClassName={pathClassName}
			color={color}
			isTrigger={isTrigger}
			duration={duration}
			ease={ease}
			enableGradientAnimation={enableGradientAnimation}
			gradientColors={gradientColors}
			gradientAnimationDuration={gradientAnimationDuration}
		/>
	);
};

export const U2 = ({
	startDelay = 0,
	delay = 0,
	scale = 1,
	isReverse,
	pathClassName,
	color,
	duration = 600,
	ease,
	isTrigger = true,
	enableGradientAnimation = false,
	gradientColors = ["#FFFFFF", "#000000", "#FFFFFF"],
	gradientAnimationDuration = 1000,
}) => {
	return (
		<LogoTypeUnitSingle
			data={path_u_2}
			width={144}
			strokeWidth={48}
			delay={delay}
			startDelay={startDelay}
			scale={scale}
			isReverse={isReverse}
			startWithReserve
			pathClassName={pathClassName}
			color={color}
			isTrigger={isTrigger}
			duration={duration}
			ease={ease}
			enableGradientAnimation={enableGradientAnimation}
			gradientColors={gradientColors}
			gradientAnimationDuration={gradientAnimationDuration}
		/>
	);
};

export const B = ({
	startDelay = 0,
	delay = 0,
	scale = 1,
	isReverse,
	pathClassName,
	color,
	duration = 600,
	ease,
	isTrigger = true,
	enableGradientAnimation = false,
	gradientColors = ["#FFFFFF", "#000000", "#FFFFFF"],
	gradientAnimationDuration = 1000,
}) => {
	return (
		<LogoTypeUnitSingle
			data={path_B_geometric}
			strokeWidth={36}
			width={140}
			delay={delay}
			startDelay={startDelay}
			scale={scale}
			pathClassName={pathClassName}
			isReverse={isReverse}
			startWithReserve
			color={color}
			isTrigger={isTrigger}
			duration={duration}
			ease={ease}
			enableGradientAnimation={enableGradientAnimation}
			gradientColors={gradientColors}
			gradientAnimationDuration={gradientAnimationDuration}
		/>
	);
};

export const L = ({
	startDelay = 0,
	delay = 0,
	scale = 1,
	isReverse,
	pathClassName,
	color,
	duration = 600,
	ease,
	isTrigger = true,
	enableGradientAnimation = false,
	gradientColors = ["#FFFFFF", "#000000", "#FFFFFF"],
	gradientAnimationDuration = 1000,
}) => {
	return (
		<LogoTypeUnitSingle
			data={path_L}
			width={120}
			strokeWidth={48}
			delay={delay}
			startDelay={startDelay}
			scale={scale}
			pathClassName={pathClassName}
			isReverse={isReverse}
			startWithReserve
			color={color}
			isTrigger={isTrigger}
			duration={duration}
			ease={ease}
			enableGradientAnimation={enableGradientAnimation}
			gradientColors={gradientColors}
			gradientAnimationDuration={gradientAnimationDuration}
		/>
	);
};
