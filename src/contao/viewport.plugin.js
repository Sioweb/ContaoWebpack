import { Events } from "./events.plugin";

export class Viewport extends Events {
	breakpoints = {
		xs: 0,
		sm: 576,
		md: 768,
		lg: 992,
		xl: 1200,
		xxl: 1440,
		xxxl: 1600,
		fhd: 1920
  	};

	breakpoint = 'xs';

	static isBigger(is, as) {
		const breakpoints = (new this).breakpoints;
		return (breakpoints[is] > breakpoints[as])
	}

	static isBiggerOrEqual(is, as) {
		const breakpoints = (new this).breakpoints;
		return (breakpoints[is] >= breakpoints[as])
	}

	static isSmaller(is, as) {
		const breakpoints = (new this).breakpoints;
		return (breakpoints[is] < breakpoints[as])
	}

	static isSmallerOrEqual(is, as) {
		const breakpoints = (new this).breakpoints;
		return (breakpoints[is] <= breakpoints[as])
	}

	initViewport() {
		this.viewportTimeout = null;

		super.registrateEvent('breakpointChanged');

		this.setupViewport();
		addEventListener("resize", (event) => {
			this.setupViewport();
		});
	}
	
	setupViewport() {
		let breakpoint = null;
		if (this.viewportTimeout) {
			clearTimeout(this.viewportTimeout);
		}
		this.viewportTimeout = setTimeout(() => {
			breakpoint = 'xs';
			for (let name in this.breakpoints) {
				if (this.breakpoints[name] < window.innerWidth) {
					breakpoint = name;
				} else {
					break;
				}
			}

			if (this.breakpoint !== breakpoint) {
				let oldBreakpoint = this.breakpoint;
				this.breakpoint = breakpoint;
				super.dispatch('breakpointChanged', { breakpoint, oldBreakpoint });
			}
		}, 150);
	}

	getBreakpoint() {
		return this.breakpoint;
	}
}