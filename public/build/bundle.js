
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
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        if (value != null || input.value) {
            input.value = value;
        }
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

    /* src\component\solt.svelte generated by Svelte v3.22.3 */

    const file = "src\\component\\solt.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	return child_ctx;
    }

    // (8:1) {#each lk as nb}
    function create_each_block(ctx) {
    	let div1;
    	let div0;
    	let t0_value = /*nb*/ ctx[4] + "";
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(div0, "class", "fancy svelte-1u3r5jo");
    			add_location(div0, file, 9, 3, 198);
    			attr_dev(div1, "class", "solt svelte-1u3r5jo");
    			add_location(div1, file, 8, 2, 175);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, t0);
    			append_dev(div1, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*lk*/ 1 && t0_value !== (t0_value = /*nb*/ ctx[4] + "")) set_data_dev(t0, t0_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(8:1) {#each lk as nb}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let div1;
    	let div0;
    	let t0;
    	let t1;
    	let dispose;
    	let each_value = /*lk*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			main = element("main");
    			div1 = element("div");
    			div0 = element("div");
    			t0 = text(/*lb*/ ctx[1]);
    			t1 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div0, "class", "label svelte-1u3r5jo");
    			add_location(div0, file, 5, 2, 88);
    			attr_dev(div1, "class", "solt svelte-1u3r5jo");
    			add_location(div1, file, 4, 1, 66);
    			add_location(main, file, 3, 0, 57);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div1);
    			append_dev(div1, div0);
    			append_dev(div0, t0);
    			append_dev(main, t1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(main, null);
    			}

    			if (remount) dispose();
    			dispose = listen_dev(div0, "click", /*click_handler*/ ctx[3], false, false, false);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*lb*/ 2) set_data_dev(t0, /*lb*/ ctx[1]);

    			if (dirty & /*lk*/ 1) {
    				each_value = /*lk*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(main, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_each(each_blocks, detaching);
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
    	let { lk = [] } = $$props, { lb = "A" } = $$props, { addOne } = $$props;
    	const writable_props = ["lk", "lb", "addOne"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Solt> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Solt", $$slots, []);
    	const click_handler = () => addOne(lk);

    	$$self.$set = $$props => {
    		if ("lk" in $$props) $$invalidate(0, lk = $$props.lk);
    		if ("lb" in $$props) $$invalidate(1, lb = $$props.lb);
    		if ("addOne" in $$props) $$invalidate(2, addOne = $$props.addOne);
    	};

    	$$self.$capture_state = () => ({ lk, lb, addOne });

    	$$self.$inject_state = $$props => {
    		if ("lk" in $$props) $$invalidate(0, lk = $$props.lk);
    		if ("lb" in $$props) $$invalidate(1, lb = $$props.lb);
    		if ("addOne" in $$props) $$invalidate(2, addOne = $$props.addOne);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [lk, lb, addOne, click_handler];
    }

    class Solt extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { lk: 0, lb: 1, addOne: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Solt",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*addOne*/ ctx[2] === undefined && !("addOne" in props)) {
    			console.warn("<Solt> was created without expected prop 'addOne'");
    		}
    	}

    	get lk() {
    		throw new Error("<Solt>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set lk(value) {
    		throw new Error("<Solt>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get lb() {
    		throw new Error("<Solt>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set lb(value) {
    		throw new Error("<Solt>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get addOne() {
    		throw new Error("<Solt>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set addOne(value) {
    		throw new Error("<Solt>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\App.svelte generated by Svelte v3.22.3 */
    const file$1 = "src\\App.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[11] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[14] = list[i];
    	return child_ctx;
    }

    // (66:3) {#each luckMe as lm}
    function create_each_block_1(ctx) {
    	let li;
    	let a;
    	let t0_value = /*lm*/ ctx[14] + "";
    	let t0;
    	let t1;
    	let span;
    	let img;
    	let img_src_value;
    	let t2;

    	const block = {
    		c: function create() {
    			li = element("li");
    			a = element("a");
    			t0 = text(t0_value);
    			t1 = space();
    			span = element("span");
    			img = element("img");
    			t2 = space();
    			attr_dev(a, "href", "");
    			attr_dev(a, "class", "svelte-vykjp1");
    			add_location(a, file$1, 66, 8, 1260);
    			if (img.src !== (img_src_value = "close.jpeg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "class", "svelte-vykjp1");
    			add_location(img, file$1, 66, 47, 1299);
    			attr_dev(span, "class", "btn svelte-vykjp1");
    			add_location(span, file$1, 66, 28, 1280);
    			add_location(li, file$1, 66, 4, 1256);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, a);
    			append_dev(a, t0);
    			append_dev(li, t1);
    			append_dev(li, span);
    			append_dev(span, img);
    			append_dev(li, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*luckMe*/ 2 && t0_value !== (t0_value = /*lm*/ ctx[14] + "")) set_data_dev(t0, t0_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(66:3) {#each luckMe as lm}",
    		ctx
    	});

    	return block;
    }

    // (76:2) {#each s as lk}
    function create_each_block$1(ctx) {
    	let current;

    	const solt = new Solt({
    			props: {
    				lk: /*lk*/ ctx[11],
    				lb: /*lb*/ ctx[3],
    				addOne: /*AddLuck*/ ctx[7]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(solt.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(solt, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const solt_changes = {};
    			if (dirty & /*s*/ 1) solt_changes.lk = /*lk*/ ctx[11];
    			solt.$set(solt_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(solt.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(solt.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(solt, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(76:2) {#each s as lk}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let main;
    	let div1;
    	let span;
    	let input;
    	let t1;
    	let br;
    	let t2;
    	let button0;
    	let t4;
    	let button1;
    	let t6;
    	let ul;
    	let t7;
    	let div0;
    	let a;
    	let t9;
    	let div2;
    	let current;
    	let dispose;
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
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			main = element("main");
    			div1 = element("div");
    			span = element("span");
    			span.textContent = "获奖人数：";
    			input = element("input");
    			t1 = space();
    			br = element("br");
    			t2 = space();
    			button0 = element("button");
    			button0.textContent = "开 始";
    			t4 = space();
    			button1 = element("button");
    			button1.textContent = "停 止";
    			t6 = space();
    			ul = element("ul");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t7 = space();
    			div0 = element("div");
    			a = element("a");
    			a.textContent = "开放源代码: github.com/egotom/LuckyMe";
    			t9 = space();
    			div2 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(span, "class", "label svelte-vykjp1");
    			add_location(span, file$1, 60, 2, 1016);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "id", "luckMax");
    			add_location(input, file$1, 60, 34, 1048);
    			add_location(br, file$1, 61, 2, 1120);
    			add_location(button0, file$1, 62, 2, 1128);
    			add_location(button1, file$1, 63, 2, 1168);
    			attr_dev(ul, "class", "luckMe svelte-vykjp1");
    			add_location(ul, file$1, 64, 2, 1208);
    			attr_dev(a, "href", "https://github.com/egotom/LuckyMe");
    			attr_dev(a, "target", "_blank");
    			add_location(a, file$1, 70, 3, 1380);
    			attr_dev(div0, "class", "open svelte-vykjp1");
    			add_location(div0, file$1, 69, 2, 1358);
    			attr_dev(div1, "class", "opt");
    			add_location(div1, file$1, 59, 1, 996);
    			attr_dev(div2, "class", "bod");
    			add_location(div2, file$1, 74, 1, 1498);
    			attr_dev(main, "class", "svelte-vykjp1");
    			add_location(main, file$1, 58, 0, 987);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div1);
    			append_dev(div1, span);
    			append_dev(div1, input);
    			set_input_value(input, /*luckMax*/ ctx[2]);
    			append_dev(div1, t1);
    			append_dev(div1, br);
    			append_dev(div1, t2);
    			append_dev(div1, button0);
    			append_dev(div1, t4);
    			append_dev(div1, button1);
    			append_dev(div1, t6);
    			append_dev(div1, ul);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(ul, null);
    			}

    			append_dev(div1, t7);
    			append_dev(div1, div0);
    			append_dev(div0, a);
    			append_dev(main, t9);
    			append_dev(main, div2);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div2, null);
    			}

    			current = true;
    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(input, "keyup", /*Init*/ ctx[4], false, false, false),
    				listen_dev(input, "input", /*input_input_handler*/ ctx[10]),
    				listen_dev(button0, "click", /*Start*/ ctx[6], false, false, false),
    				listen_dev(button1, "click", /*Pause*/ ctx[5], false, false, false)
    			];
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*luckMax*/ 4 && input.value !== /*luckMax*/ ctx[2]) {
    				set_input_value(input, /*luckMax*/ ctx[2]);
    			}

    			if (dirty & /*luckMe*/ 2) {
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

    			if (dirty & /*s, lb, AddLuck*/ 137) {
    				each_value = /*s*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
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
    	let s = [], luckMe = [];
    	let lb = "B";
    	let soltMax = 4;
    	let luckMax = 3;
    	let ts = null;

    	function Init() {
    		$$invalidate(0, s = []);

    		for (let i = 0; i < luckMax; i++) {
    			let col = [];

    			for (let j = 0; j < soltMax; j++) {
    				col.push(0);
    			}

    			s.push(col);
    		}
    	}

    	Init();

    	function Pause() {
    		window.clearTimeout(ts);
    		ts = null;
    	}

    	function Start() {
    		ts = window.setTimeout(Start, 20);
    		let idx = 0;
    		let idy = 0;

    		while (true) {
    			let number = Math.round(Math.random() * 10);

    			if (number < 10) {
    				$$invalidate(0, s[idy][idx] = number, s);
    				idx++;

    				if (idx == soltMax) {
    					idy++;
    					idx = 0;
    				}
    			}

    			if (idx > soltMax && idy > luckMax) break;
    		}
    	}

    	function AddLuck(lkm) {
    		//console.log(lkm);
    		let me = lb + "-";

    		for (let i in lkm) {
    			me += lkm[i];
    		}

    		luckMe.push(me);
    		$$invalidate(1, luckMe);
    	} //console.log(me);

    	onMount(async () => {
    		
    	}); //const res = await fetch(`https://jsonplaceholder.typicode.com/photos?_limit=20`);
    	//photos = await res.json();

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("App", $$slots, []);

    	function input_input_handler() {
    		luckMax = this.value;
    		$$invalidate(2, luckMax);
    	}

    	$$self.$capture_state = () => ({
    		onMount,
    		Solt,
    		s,
    		luckMe,
    		lb,
    		soltMax,
    		luckMax,
    		ts,
    		Init,
    		Pause,
    		Start,
    		AddLuck
    	});

    	$$self.$inject_state = $$props => {
    		if ("s" in $$props) $$invalidate(0, s = $$props.s);
    		if ("luckMe" in $$props) $$invalidate(1, luckMe = $$props.luckMe);
    		if ("lb" in $$props) $$invalidate(3, lb = $$props.lb);
    		if ("soltMax" in $$props) soltMax = $$props.soltMax;
    		if ("luckMax" in $$props) $$invalidate(2, luckMax = $$props.luckMax);
    		if ("ts" in $$props) ts = $$props.ts;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		s,
    		luckMe,
    		luckMax,
    		lb,
    		Init,
    		Pause,
    		Start,
    		AddLuck,
    		ts,
    		soltMax,
    		input_input_handler
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
