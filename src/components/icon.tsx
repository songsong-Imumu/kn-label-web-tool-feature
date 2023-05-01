import { createFromIconfontCN } from '@ant-design/icons';
import { IconFontProps } from '@ant-design/icons/es/components/IconFont';
import { FunctionComponent } from 'react';

const IconSet: FunctionComponent<IconFontProps> = createFromIconfontCN({
  scriptUrl: ['//at.alicdn.com/t/c/font_3649295_2iihe81j6lw.js', '//at.alicdn.com/t/font_3133245_xu9s07jepb.js'] // 在 iconfont.cn 上生成
});

export default IconSet;
