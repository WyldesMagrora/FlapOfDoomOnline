class ShopScene extends Phaser.Scene {
    constructor() {
        super('ShopScene');
        this.selectedCategory = 'birds';
        this.selectedItem = 0;
    }

    create() {
        this.add.image(0, 0, `background-${playerData.currentBackground}`).setOrigin(0).setDisplaySize(config.SCREEN_WIDTH, config.SCREEN_HEIGHT);

        // Create overlay
        this.overlay = this.add.rectangle(0, 0, config.SCREEN_WIDTH, config.SCREEN_HEIGHT, 0x000000, 0.7).setOrigin(0);

        // Shop title
        this.add.text(config.SCREEN_WIDTH / 2, 50, 'SHOP', { fontSize: '48px', fill: '#fff' }).setOrigin(0.5);

        // Coins display
        this.coinIcon = this.add.image(20, 20, 'coin').setScale(0.5);
        this.coinText = this.add.text(50, 10, Utils.formatNumber(playerData.coins), { fontSize: '24px', fill: '#fff' });

        // Category buttons
        this.createCategoryButtons();

        // Item list
        this.itemList = this.add.container(0, 150);
        this.updateItemList();

        // Input events
        this.input.keyboard.on('keydown-ESC', () => this.scene.start('MenuScene'));
        this.input.on('pointerdown', this.handleClick, this);
    }

    createCategoryButtons() {
        const categories = ['Birds', 'Backgrounds', 'Particles'];
        const buttonWidth = config.SCREEN_WIDTH / 3;

        categories.forEach((category, index) => {
            const button = this.add.rectangle(buttonWidth * index, 100, buttonWidth, 40, 0xffffff, 0.3)
                .setOrigin(0)
                .setInteractive();

            const text = this.add.text(buttonWidth * index + buttonWidth / 2, 120, category, { fontSize: '24px', fill: '#fff' })
                .setOrigin(0.5);

            button.on('pointerdown', () => this.selectCategory(category.toLowerCase()));
        });
    }

    selectCategory(category) {
        this.selectedCategory = category;
        this.selectedItem = 0;
        this.updateItemList();
    }

    updateItemList() {
        this.itemList.removeAll(true);

        const items = this.getItemsForCategory();
        items.forEach((item, index) => {
            const itemContainer = this.createItemContainer(item, index);
            this.itemList.add(itemContainer);
        });
    }

    getItemsForCategory() {
        switch (this.selectedCategory) {
            case 'birds': return Object.keys(BIRD_SKINS);
            case 'backgrounds': return Object.keys(BACKGROUND_SKINS);
            case 'particles': return Object.keys(PARTICLE_EFFECTS);
            default: return [];
        }
    }

    createItemContainer(itemName, index) {
        const y = index * 80;
        const container = this.add.container(10, y);

        const bg = this.add.rectangle(0, 0, config.SCREEN_WIDTH - 20, 70, 0xffffff, 0.1)
            .setOrigin(0)
            .setInteractive();

        const nameText = this.add.text(80, 10, itemName, { fontSize: '24px', fill: '#fff' });

        const preview = this.createPreview(itemName, 40, 35);

        const statusText = this.createStatusText(itemName, 80, 40);

        container.add([bg, nameText, preview, statusText]);
        return container;
    }

    createPreview(itemName, x, y) {
        if (this.selectedCategory === 'birds') {
            return this.add.image(x, y, `${itemName}_bird`, 1).setScale(0.8);
        } else if (this.selectedCategory === 'backgrounds') {
            return this.add.image(x, y, `background-${itemName}`).setScale(0.2);
        } else {
            const color = config.PARTICLE_COLORS[PARTICLE_EFFECTS[itemName].color];
            return this.add.circle(x, y, 20, color);
        }
    }

    createStatusText(itemName, x, y) {
        const isUnlocked = this.isItemUnlocked(itemName);
        const isSelected = this.isItemSelected(itemName);
        const price = this.getItemPrice(itemName);

        if (isSelected) {
            return this.add.text(x, y, 'Selected', { fontSize: '20px', fill: '#00ff00' });
        } else if (isUnlocked) {
            return this.add.text(x, y, 'Unlocked', { fontSize: '20px', fill: '#0000ff' });
        } else {
            return this.add.text(x, y, `${price} coins`, { fontSize: '20px', fill: '#ffff00' });
        }
    }

    isItemUnlocked(itemName) {
        switch (this.selectedCategory) {
            case 'birds': return playerData.unlockedBirds[itemName];
            case 'backgrounds': return playerData.unlockedBackgrounds[itemName];
            case 'particles': return playerData.unlockedParticles[itemName];
            default: return false;
        }
    }

    isItemSelected(itemName) {
        switch (this.selectedCategory) {
            case 'birds': return playerData.currentBird === itemName;
            case 'backgrounds': return playerData.currentBackground === itemName;
            case 'particles': return playerData.currentParticleEffect === itemName;
            default: return false;
        }
    }

    getItemPrice(itemName) {
        switch (this.selectedCategory) {
            case 'birds': return BIRD_SKINS[itemName].price;
            case 'backgrounds': return BACKGROUND_SKINS[itemName].price;
            case 'particles': return PARTICLE_EFFECTS[itemName].price;
            default: return 0;
        }
    }

    handleClick(pointer) {
        const items = this.getItemsForCategory();
        const clickedIndex = Math.floor((pointer.y - 150) / 80);

        if (clickedIndex >= 0 && clickedIndex < items.length) {
            this.selectedItem = clickedIndex;
            this.tryPurchaseOrSelect(items[clickedIndex]);
        }
    }

    tryPurchaseOrSelect(itemName) {
        if (this.isItemUnlocked(itemName)) {
            this.selectItem(itemName);
        } else {
            this.tryPurchaseItem(itemName);
        }
    }

    selectItem(itemName) {
        switch (this.selectedCategory) {
            case 'birds':
                playerData.currentBird = itemName;
                break;
            case 'backgrounds':
                playerData.currentBackground = itemName;
                break;
            case 'particles':
                playerData.currentParticleEffect = itemName;
                break;
        }
        playerData.saveData();
        this.sound.play('point');
        this.updateItemList();
    }

    tryPurchaseItem(itemName) {
        const price = this.getItemPrice(itemName);
        if (playerData.coins >= price) {
            playerData.coins -= price;
            switch (this.selectedCategory) {
                case 'birds':
                    playerData.unlockedBirds[itemName] = true;
                    break;
                case 'backgrounds':
                    playerData.unlockedBackgrounds[itemName] = true;
                    break;
                case 'particles':
                    if (Utils.canUnlockParticle(itemName, playerData)) {
                        playerData.unlockedParticles[itemName] = true;
                    } else {
                        this.sound.play('hit');
                        return;
                    }
                    break;
            }
            playerData.saveData();
            this.sound.play('point');
            this.coinText.setText(Utils.formatNumber(playerData.coins));
            this.updateItemList();
        } else {
            this.sound.play('hit');
        }
    }
}
