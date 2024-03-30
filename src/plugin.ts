import type { BuildParams, PluginOptions, PluginType } from '@glightbox/plugin-core';
import { GLightboxPlugin } from '@glightbox/plugin-core';

// Define interface for your options
export interface MyPluginOptions extends PluginOptions {
    color?: string;
    text?: string;
}

export default class MyPlugin extends GLightboxPlugin {

    // name of the plugin
    name = 'image';


    // type of the plugin
    type: PluginType = 'slide';


    // custom plugin options
    options: MyPluginOptions = {};


    // define some default plugin options
    defaults: MyPluginOptions = {
        color: 'red',
        text: 'example'
    };


    constructor(options: Partial<PluginOptions> = {}) {
        super();
        this.options = { ...this.defaults, ...options };
    }


    /**
     * This method is called when the plugin is initialized
     * Use it to define event listeners, etc.
     * You can also listen events from GLightbox and do certain actions.
     *
     * You can delete this method if you don't need it
    */
    init(): void {

        // You can use this.instance to access the GLightbox instance
        // with that you have full access to all methods and properties
        const galleryItems = this.instance.getItems();
        const activeSlide = this.instance.getActiveSlide();

        // Do something before the slide is changed
        // for example pause audio in the active slide, etc.
        this.instance.on('slide_before_change', () => {
            const currentSlide = this.instance.getActiveSlide();
        });
    }


    /**
     * This method is called when the lightbox is closed
     * Use it to define remove listeners and cleanup.
     *
     * You can delete this method if you don't need it
    */
    destroy(): void {

    }


    /**
     * If you are creating a "slide" type plugin, with this method you can
     * notify GLightbox that your plugin can handle certain type of content
     * For example: If you are creating an audio plugin, you can check if the URL
     * provided by the user includes an audio file extension and if so, return true
     * so GLightbox calls your build method.
     *
     * You can delete this method if you don't need it
    */
    public match(url: string): boolean {
        let matches = false;
        if (url.includes('.mp3')) {
            matches = true;
        }
        return matches;
    }


    /**
     * Use this method to display what you want in the slide
     * This method should return a promise,
     * If there's errors you can use reject to notify GLightbox
     * and your error message will be displayed to the user
    */
    build({ index, slide, config }: BuildParams): Promise<boolean> {
        return new Promise((resolve, reject) => {

            // You can access the plugins options with this.options
            const color = this.options?.color;

            // Insert your HTML into the slide
            slide?.insertAdjacentHTML('beforeend', `<div class="my-plugin-slide">${this.options?.text}</div>`);


            // This is totally optional. You can use this to define
            // some CSS variables that you can use in your CSS, for example in the method cssStyle
            if (color) {
                slide?.style.setProperty('--gl-my-slide-color', color);
            }

            // if you want to return an error
            // reject('There was an error loading the image')

            resolve(true);
        });
    }


    /**
     * Sometimes your plugins needs a small CSS, instead of creating a new file
     * you can define it here. This code will be injected and removed by GLightbox
     *
     * You can delete this method if you don't need it
    */
    cssStyle(): string {
        return `
            .my-plugin-slide {
                background: var(--gl-my-slide-color);
                min-width: 300px;
                min-height: 300px;
                padding: 2rem;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 2rem;
                font-family: system-ui;
            }
        `;
    }


    /**
     * If your plugin requires adding some CSS files or JS files
     * you can define them here, they will be injected and removed by GLightbox when
     * required
    */
    assets() {
        return {
            css: ['my-plugin.css', 'other-style.css'],
            js: [{
                'src': 'file.js',
                'module': true // set to true if it's a module, otherwise set to false or remove this line
            }, {
                'src': 'another-file.js'
            }]
        };
    }
}
