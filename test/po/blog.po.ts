export default new class BlogPo {
    createPostSelector = '[resource=blog][authorize=createPost]';
    cancelSelector = 'button.cancel';

    waitForVisible(): WebdriverIO.Client<boolean> {
        return browser.waitForVisible(this.createPostSelector);
    }

    get newPost(): WebdriverIO.Client<WebdriverIO.Element> {
        return browser.element<WebdriverIO.Element>(this.createPostSelector);
    }

    get cancelNewPost(): WebdriverIO.Client<WebdriverIO.Element> {
        return browser.element<WebdriverIO.Element>(this.cancelSelector);
    }
}
