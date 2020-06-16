
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function to_number(value) {
        return value === '' ? undefined : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        if (value != null || input.value) {
            input.value = value;
        }
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error(`Function called outside component initialization`);
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if ($$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.22.3' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev("SvelteDOMSetData", { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = [];
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (let i = 0; i < subscribers.length; i += 1) {
                        const s = subscribers[i];
                        s[1]();
                        subscriber_queue.push(s, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
                if (subscribers.length === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    /* src\component\ticket.svelte generated by Svelte v3.22.3 */

    const file = "src\\component\\ticket.svelte";

    function create_fragment(ctx) {
    	let div7;
    	let div2;
    	let div0;
    	let t0_value = /*tick*/ ctx[0].dpt + "";
    	let t0;
    	let t1;
    	let t2_value = /*tick*/ ctx[0].name + "";
    	let t2;
    	let t3;
    	let div1;
    	let t4;
    	let t5;
    	let t6;
    	let t7_value = /*tick*/ ctx[0].no + "";
    	let t7;
    	let t8;
    	let div3;
    	let t9_value = /*tick*/ ctx[0].desc + "";
    	let t9;
    	let t10;
    	let div6;
    	let div4;
    	let t11;
    	let div5;
    	let t12_value = /*tick*/ ctx[0].ts + "";
    	let t12;
    	let dispose;

    	const block = {
    		c: function create() {
    			div7 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			t0 = text(t0_value);
    			t1 = text("-");
    			t2 = text(t2_value);
    			t3 = space();
    			div1 = element("div");
    			t4 = text("序列号：");
    			t5 = text(/*cpt*/ ctx[2]);
    			t6 = text("-");
    			t7 = text(t7_value);
    			t8 = space();
    			div3 = element("div");
    			t9 = text(t9_value);
    			t10 = space();
    			div6 = element("div");
    			div4 = element("div");
    			t11 = space();
    			div5 = element("div");
    			t12 = text(t12_value);
    			attr_dev(div0, "class", "to");
    			add_location(div0, file, 5, 2, 212);
    			attr_dev(div1, "class", "no");
    			add_location(div1, file, 6, 2, 260);
    			attr_dev(div2, "class", "hd svelte-1p4s9xj");
    			add_location(div2, file, 4, 1, 192);
    			attr_dev(div3, "class", "why svelte-1p4s9xj");
    			add_location(div3, file, 8, 1, 313);
    			add_location(div4, file, 10, 2, 370);
    			attr_dev(div5, "class", "ts");
    			add_location(div5, file, 11, 2, 385);
    			attr_dev(div6, "class", "hd svelte-1p4s9xj");
    			add_location(div6, file, 9, 1, 350);
    			attr_dev(div7, "class", "tkt svelte-1p4s9xj");
    			toggle_class(div7, "gr", /*tick*/ ctx[0].green);
    			add_location(div7, file, 3, 0, 121);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, div7, anchor);
    			append_dev(div7, div2);
    			append_dev(div2, div0);
    			append_dev(div0, t0);
    			append_dev(div0, t1);
    			append_dev(div0, t2);
    			append_dev(div2, t3);
    			append_dev(div2, div1);
    			append_dev(div1, t4);
    			append_dev(div1, t5);
    			append_dev(div1, t6);
    			append_dev(div1, t7);
    			append_dev(div7, t8);
    			append_dev(div7, div3);
    			append_dev(div3, t9);
    			append_dev(div7, t10);
    			append_dev(div7, div6);
    			append_dev(div6, div4);
    			append_dev(div6, t11);
    			append_dev(div6, div5);
    			append_dev(div5, t12);
    			if (remount) dispose();
    			dispose = listen_dev(div7, "click", /*click_handler*/ ctx[3], false, false, false);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*tick*/ 1 && t0_value !== (t0_value = /*tick*/ ctx[0].dpt + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*tick*/ 1 && t2_value !== (t2_value = /*tick*/ ctx[0].name + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*cpt*/ 4) set_data_dev(t5, /*cpt*/ ctx[2]);
    			if (dirty & /*tick*/ 1 && t7_value !== (t7_value = /*tick*/ ctx[0].no + "")) set_data_dev(t7, t7_value);
    			if (dirty & /*tick*/ 1 && t9_value !== (t9_value = /*tick*/ ctx[0].desc + "")) set_data_dev(t9, t9_value);
    			if (dirty & /*tick*/ 1 && t12_value !== (t12_value = /*tick*/ ctx[0].ts + "")) set_data_dev(t12, t12_value);

    			if (dirty & /*tick*/ 1) {
    				toggle_class(div7, "gr", /*tick*/ ctx[0].green);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div7);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { tick = {
    			"dpt": "",
    			"name": "",
    			"no": "",
    			"desc": "",
    			"ts": "",
    			"green": true
    		} } = $$props,
    		{ addOne = null } = $$props,
    		{ cpt = "" } = $$props;

    	const writable_props = ["tick", "addOne", "cpt"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Ticket> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Ticket", $$slots, []);
    	const click_handler = () => addOne(tick);

    	$$self.$set = $$props => {
    		if ("tick" in $$props) $$invalidate(0, tick = $$props.tick);
    		if ("addOne" in $$props) $$invalidate(1, addOne = $$props.addOne);
    		if ("cpt" in $$props) $$invalidate(2, cpt = $$props.cpt);
    	};

    	$$self.$capture_state = () => ({ tick, addOne, cpt });

    	$$self.$inject_state = $$props => {
    		if ("tick" in $$props) $$invalidate(0, tick = $$props.tick);
    		if ("addOne" in $$props) $$invalidate(1, addOne = $$props.addOne);
    		if ("cpt" in $$props) $$invalidate(2, cpt = $$props.cpt);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [tick, addOne, cpt, click_handler];
    }

    class Ticket extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { tick: 0, addOne: 1, cpt: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Ticket",
    			options,
    			id: create_fragment.name
    		});
    	}

    	get tick() {
    		throw new Error("<Ticket>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tick(value) {
    		throw new Error("<Ticket>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get addOne() {
    		throw new Error("<Ticket>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set addOne(value) {
    		throw new Error("<Ticket>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get cpt() {
    		throw new Error("<Ticket>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set cpt(value) {
    		throw new Error("<Ticket>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\App.svelte generated by Svelte v3.22.3 */
    const file$1 = "src\\App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[23] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[26] = list[i];
    	return child_ctx;
    }

    // (99:1) {#if modal}
    function create_if_block(ctx) {
    	let div3;
    	let div2;
    	let div1;
    	let div0;
    	let p0;
    	let t0_value = /*me*/ ctx[2].dpt + "";
    	let t0;
    	let t1;
    	let t2_value = /*me*/ ctx[2].name + "";
    	let t2;
    	let t3;
    	let p1;
    	let t4;
    	let t5;
    	let t6_value = /*me*/ ctx[2].no + "";
    	let t6;
    	let t7;
    	let p2;
    	let t8_value = /*me*/ ctx[2].desc + "";
    	let t8;
    	let t9;
    	let p3;
    	let t10_value = /*me*/ ctx[2].ts + "";
    	let t10;
    	let dispose;

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			p0 = element("p");
    			t0 = text(t0_value);
    			t1 = text(" - ");
    			t2 = text(t2_value);
    			t3 = space();
    			p1 = element("p");
    			t4 = text(/*lb*/ ctx[4]);
    			t5 = text("-");
    			t6 = text(t6_value);
    			t7 = space();
    			p2 = element("p");
    			t8 = text(t8_value);
    			t9 = space();
    			p3 = element("p");
    			t10 = text(t10_value);
    			attr_dev(p0, "class", "who svelte-75oxo0");
    			add_location(p0, file$1, 103, 5, 2088);
    			attr_dev(p1, "class", "sel svelte-75oxo0");
    			add_location(p1, file$1, 104, 5, 2133);
    			attr_dev(p2, "class", "why svelte-75oxo0");
    			add_location(p2, file$1, 105, 5, 2170);
    			attr_dev(p3, "class", "when svelte-75oxo0");
    			add_location(p3, file$1, 106, 5, 2204);
    			attr_dev(div0, "class", "info svelte-75oxo0");
    			add_location(div0, file$1, 102, 4, 2064);
    			attr_dev(div1, "class", "modal svelte-75oxo0");
    			add_location(div1, file$1, 101, 3, 2021);
    			attr_dev(div2, "class", "back svelte-75oxo0");
    			add_location(div2, file$1, 100, 2, 1999);
    			attr_dev(div3, "class", "backdrop svelte-75oxo0");
    			add_location(div3, file$1, 99, 1, 1974);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			append_dev(div0, p0);
    			append_dev(p0, t0);
    			append_dev(p0, t1);
    			append_dev(p0, t2);
    			append_dev(div0, t3);
    			append_dev(div0, p1);
    			append_dev(p1, t4);
    			append_dev(p1, t5);
    			append_dev(p1, t6);
    			append_dev(div0, t7);
    			append_dev(div0, p2);
    			append_dev(p2, t8);
    			append_dev(div0, t9);
    			append_dev(div0, p3);
    			append_dev(p3, t10);
    			if (remount) dispose();
    			dispose = listen_dev(div1, "click", /*doModal*/ ctx[10], false, false, false);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*me*/ 4 && t0_value !== (t0_value = /*me*/ ctx[2].dpt + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*me*/ 4 && t2_value !== (t2_value = /*me*/ ctx[2].name + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*lb*/ 16) set_data_dev(t4, /*lb*/ ctx[4]);
    			if (dirty & /*me*/ 4 && t6_value !== (t6_value = /*me*/ ctx[2].no + "")) set_data_dev(t6, t6_value);
    			if (dirty & /*me*/ 4 && t8_value !== (t8_value = /*me*/ ctx[2].desc + "")) set_data_dev(t8, t8_value);
    			if (dirty & /*me*/ 4 && t10_value !== (t10_value = /*me*/ ctx[2].ts + "")) set_data_dev(t10, t10_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(99:1) {#if modal}",
    		ctx
    	});

    	return block;
    }

    // (123:4) {#each luckMe as lm}
    function create_each_block_1(ctx) {
    	let li;
    	let b;
    	let t0;
    	let t1;
    	let t2_value = /*lm*/ ctx[26] + "";
    	let t2;
    	let dispose;

    	function click_handler(...args) {
    		return /*click_handler*/ ctx[22](/*lm*/ ctx[26], ...args);
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			b = element("b");
    			t0 = text(/*lb*/ ctx[4]);
    			t1 = text("-");
    			t2 = text(t2_value);
    			attr_dev(b, "class", "svelte-75oxo0");
    			add_location(b, file$1, 123, 9, 2641);
    			add_location(li, file$1, 123, 5, 2637);
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, li, anchor);
    			append_dev(li, b);
    			append_dev(b, t0);
    			append_dev(b, t1);
    			append_dev(b, t2);
    			if (remount) dispose();
    			dispose = listen_dev(b, "click", click_handler, false, false, false);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*lb*/ 16) set_data_dev(t0, /*lb*/ ctx[4]);
    			if (dirty & /*luckMe*/ 2 && t2_value !== (t2_value = /*lm*/ ctx[26] + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(123:4) {#each luckMe as lm}",
    		ctx
    	});

    	return block;
    }

    // (132:3) {#each s as lk}
    function create_each_block(ctx) {
    	let div;
    	let t;
    	let current;

    	const ticket = new Ticket({
    			props: {
    				tick: /*lk*/ ctx[23],
    				addOne: /*AddLuck*/ ctx[9],
    				cpt: /*lb*/ ctx[4]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(ticket.$$.fragment);
    			t = space();
    			add_location(div, file$1, 132, 4, 2920);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(ticket, div, null);
    			append_dev(div, t);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const ticket_changes = {};
    			if (dirty & /*s*/ 1) ticket_changes.tick = /*lk*/ ctx[23];
    			if (dirty & /*lb*/ 16) ticket_changes.cpt = /*lb*/ ctx[4];
    			ticket.$set(ticket_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(ticket.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(ticket.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(ticket);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(132:3) {#each s as lk}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let main;
    	let t0;
    	let div3;
    	let div1;
    	let span;
    	let input;
    	let t2;
    	let br0;
    	let t3;
    	let button0;
    	let t5;
    	let br1;
    	let t6;
    	let button1;
    	let t8;
    	let ul;
    	let p;
    	let b;
    	let t10;
    	let t11;
    	let div0;
    	let a;
    	let t13;
    	let div2;
    	let current;
    	let dispose;
    	let if_block = /*modal*/ ctx[3] && create_if_block(ctx);
    	let each_value_1 = /*luckMe*/ ctx[1];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	let each_value = /*s*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			main = element("main");
    			if (if_block) if_block.c();
    			t0 = space();
    			div3 = element("div");
    			div1 = element("div");
    			span = element("span");
    			span.textContent = "获奖人数：";
    			input = element("input");
    			t2 = space();
    			br0 = element("br");
    			t3 = space();
    			button0 = element("button");
    			button0.textContent = "开 始";
    			t5 = space();
    			br1 = element("br");
    			t6 = space();
    			button1 = element("button");
    			button1.textContent = "停 止";
    			t8 = space();
    			ul = element("ul");
    			p = element("p");
    			b = element("b");
    			b.textContent = "已中奖序列号：";
    			t10 = space();

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t11 = space();
    			div0 = element("div");
    			a = element("a");
    			a.textContent = "开放源代码: https://github.com/egotom/LuckyMe";
    			t13 = space();
    			div2 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(span, "class", "label svelte-75oxo0");
    			add_location(span, file$1, 114, 3, 2320);
    			attr_dev(input, "type", "number");
    			attr_dev(input, "id", "luckMax");
    			attr_dev(input, "class", "w70 svelte-75oxo0");
    			add_location(input, file$1, 114, 35, 2352);
    			add_location(br0, file$1, 115, 3, 2439);
    			add_location(button0, file$1, 116, 3, 2448);
    			add_location(br1, file$1, 117, 3, 2489);
    			add_location(button1, file$1, 118, 3, 2498);
    			set_style(b, "color", "red");
    			attr_dev(b, "class", "svelte-75oxo0");
    			add_location(b, file$1, 121, 7, 2570);
    			add_location(p, file$1, 121, 4, 2567);
    			attr_dev(ul, "class", "luckMe svelte-75oxo0");
    			add_location(ul, file$1, 120, 3, 2543);
    			attr_dev(a, "href", "https://github.com/egotom/LuckyMe/tree/idiot");
    			attr_dev(a, "target", "_blank");
    			add_location(a, file$1, 127, 4, 2737);
    			attr_dev(div0, "class", "open svelte-75oxo0");
    			add_location(div0, file$1, 126, 3, 2714);
    			attr_dev(div1, "class", "opt");
    			add_location(div1, file$1, 113, 2, 2299);
    			attr_dev(div2, "class", "bod svelte-75oxo0");
    			add_location(div2, file$1, 130, 2, 2879);
    			attr_dev(div3, "class", "dash svelte-75oxo0");
    			add_location(div3, file$1, 112, 1, 2278);
    			add_location(main, file$1, 97, 0, 1953);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, main, anchor);
    			if (if_block) if_block.m(main, null);
    			append_dev(main, t0);
    			append_dev(main, div3);
    			append_dev(div3, div1);
    			append_dev(div1, span);
    			append_dev(div1, input);
    			set_input_value(input, /*luckMax*/ ctx[5]);
    			append_dev(div1, t2);
    			append_dev(div1, br0);
    			append_dev(div1, t3);
    			append_dev(div1, button0);
    			append_dev(div1, t5);
    			append_dev(div1, br1);
    			append_dev(div1, t6);
    			append_dev(div1, button1);
    			append_dev(div1, t8);
    			append_dev(div1, ul);
    			append_dev(ul, p);
    			append_dev(p, b);
    			append_dev(ul, t10);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(ul, null);
    			}

    			append_dev(div1, t11);
    			append_dev(div1, div0);
    			append_dev(div0, a);
    			append_dev(div3, t13);
    			append_dev(div3, div2);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div2, null);
    			}

    			current = true;
    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(input, "keyup", /*Init*/ ctx[6], false, false, false),
    				listen_dev(input, "input", /*input_input_handler*/ ctx[21]),
    				listen_dev(button0, "click", /*Start*/ ctx[8], false, false, false),
    				listen_dev(button1, "click", /*Pause*/ ctx[7], false, false, false)
    			];
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*modal*/ ctx[3]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					if_block.m(main, t0);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*luckMax*/ 32 && to_number(input.value) !== /*luckMax*/ ctx[5]) {
    				set_input_value(input, /*luckMax*/ ctx[5]);
    			}

    			if (dirty & /*doModal, luckMe, lb*/ 1042) {
    				each_value_1 = /*luckMe*/ ctx[1];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty & /*s, AddLuck, lb*/ 529) {
    				each_value = /*s*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div2, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if (if_block) if_block.d();
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let s = [], luckMe = [], lst, me = [], code = 33333, all = [];
    	let modal = false, confirm = false;
    	let lb = "B", error = "", dell = "";
    	let soltMax = 1;
    	let luckMax = 5;
    	let ts = null;
    	const LM = writable(JSON.parse(localStorage.getItem("luckMe")) || []);

    	const unsubscribe = LM.subscribe(value => {
    		$$invalidate(1, luckMe = value);
    	});

    	function Init() {
    		$$invalidate(0, s = []);

    		for (let i = 0; i < luckMax; i++) {

    			s.push({
    				"dpt": "",
    				"name": "",
    				"desc": "",
    				"ts": "",
    				"no": "",
    				"green": true
    			});
    		}
    	}

    	function Pause() {
    		window.clearTimeout(ts);
    		ts = null;
    	}

    	function Start() {
    		$$invalidate(0, s = []);
    		ts = window.setTimeout(Start, 2);

    		for (let i = 0; i < luckMax; ) {
    			let n1 = "";

    			for (let j = 0; j < soltMax; j++) {
    				let number = Math.floor(Math.random() * 10);
    				n1 += number.toString();
    			}

    			if (luckMe.indexOf(n1) > -1 || all.indexOf(n1) == -1) continue;
    			let n2 = null;

    			for (let d in lst) {
    				if (lst[d][6] == n1) {
    					n2 = {
    						"dpt": lst[d][2],
    						"name": lst[d][3],
    						"desc": lst[d][4],
    						"ts": lst[d][5],
    						"no": lst[d][0],
    						"green": false
    					};

    					break;
    				}
    			}

    			if (n2 == null) continue;
    			s.push(n2);
    			i++;
    		}
    	}

    	function AddLuck(lkm) {
    		for (let i in s) {
    			if (s[i].no == lkm.no) $$invalidate(0, s[i].green = true, s);
    		}

    		$$invalidate(3, modal = !modal);
    		$$invalidate(2, me = lkm);
    		$$invalidate(1, luckMe = [lkm.no, ...luckMe]);
    		LM.subscribe(localStorage.setItem("luckMe", JSON.stringify(luckMe)));
    	}

    	function doModal(v) {
    		$$invalidate(3, modal = !modal);

    		if (typeof v == "string") {
    			//console.log(v);
    			$$invalidate(2, me = null);

    			for (let i in lst) {
    				if (v == lst[i][0]) {
    					$$invalidate(2, me = {
    						"dpt": lst[i][2],
    						"name": lst[i][3],
    						"desc": lst[i][4],
    						"ts": lst[i][5],
    						"no": lst[i][0]
    					});

    					break;
    				}
    			}
    		}
    	}

    	onMount(async () => {
    		const res = await fetch(`http://120.26.118.222:5000/rflyts/4`);
    		let lty = await res.json();
    		soltMax = lty.sn;
    		$$invalidate(4, lb = lty.cpt);
    		lst = lty.lst;
    		Init();

    		//console.log(JSON.stringify(lst));
    		lty.lst.map(l => {
    			all.push(l[6]);
    		});
    	}); //console.log(JSON.stringify(all));

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("App", $$slots, []);

    	function input_input_handler() {
    		luckMax = to_number(this.value);
    		$$invalidate(5, luckMax);
    	}

    	const click_handler = lm => doModal(lm);

    	$$self.$capture_state = () => ({
    		onMount,
    		writable,
    		Ticket,
    		s,
    		luckMe,
    		lst,
    		me,
    		code,
    		all,
    		modal,
    		confirm,
    		lb,
    		error,
    		dell,
    		soltMax,
    		luckMax,
    		ts,
    		LM,
    		unsubscribe,
    		Init,
    		Pause,
    		Start,
    		AddLuck,
    		doModal
    	});

    	$$self.$inject_state = $$props => {
    		if ("s" in $$props) $$invalidate(0, s = $$props.s);
    		if ("luckMe" in $$props) $$invalidate(1, luckMe = $$props.luckMe);
    		if ("lst" in $$props) lst = $$props.lst;
    		if ("me" in $$props) $$invalidate(2, me = $$props.me);
    		if ("code" in $$props) code = $$props.code;
    		if ("all" in $$props) all = $$props.all;
    		if ("modal" in $$props) $$invalidate(3, modal = $$props.modal);
    		if ("confirm" in $$props) confirm = $$props.confirm;
    		if ("lb" in $$props) $$invalidate(4, lb = $$props.lb);
    		if ("error" in $$props) error = $$props.error;
    		if ("dell" in $$props) dell = $$props.dell;
    		if ("soltMax" in $$props) soltMax = $$props.soltMax;
    		if ("luckMax" in $$props) $$invalidate(5, luckMax = $$props.luckMax);
    		if ("ts" in $$props) ts = $$props.ts;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		s,
    		luckMe,
    		me,
    		modal,
    		lb,
    		luckMax,
    		Init,
    		Pause,
    		Start,
    		AddLuck,
    		doModal,
    		lst,
    		soltMax,
    		ts,
    		code,
    		all,
    		confirm,
    		error,
    		dell,
    		LM,
    		unsubscribe,
    		input_input_handler,
    		click_handler
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    const app = new App({target: document.body});

    return app;

}());
//# sourceMappingURL=bundle.js.map
