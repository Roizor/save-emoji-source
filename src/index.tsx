import { Plugin, registerPlugin } from 'enmity/managers/plugins';
import { React, Toasts } from 'enmity/metro/common';
import { create } from 'enmity/patcher';
import { bulk, filters } from 'enmity/metro';
import { FormRow } from 'enmity/components';
import { MessageEmojiActionSheetArgs } from './types';

import styles from './styles';
import icons from './icons';
import manifest from '../manifest.json';

const [LazyActionSheet, Clipboard] = bulk(
  filters.byProps('openLazy', 'hideActionSheet'),
  filters.byProps('setString'),
);

const Patcher = create('copy-emoji-source');

const CopyEmojiSource: Plugin = {
  ...manifest,
  onStart() {
    const unpatch = Patcher.before(LazyActionSheet, 'openLazy', ({ hideActionSheet }, [component, sheet]) => {
      if (sheet !== 'MessageEmojiActionSheet') return;

      component.then(instance => {
        Patcher.after(instance, 'default', (_, [{ emojiNode }]: MessageEmojiActionSheetArgs, res) => {
          const children = [res.props.children.props.children];

          // Let's only add the 'Copy image link' button if the emoji type is customEmoji
          // A customEmoji is one that has a `src` attribute, i.e. it was uploaded by someone to a guild.
          if (emojiNode.type === 'customEmoji') {
            children.push(
              <FormRow style={styles.copyLink} label='Copy image link' onPress={() => {
                Clipboard.setString(emojiNode.src);
                Toasts.open({ content: 'Copied to clipboard', source: icons.copy });
                hideActionSheet();
              }} />,
            );
          }

          res.props.children.props.children = children;
        });

        unpatch();
      });
    });
  },
  onStop() {
    Patcher.unpatchAll();
  },
};

registerPlugin(CopyEmojiSource);
