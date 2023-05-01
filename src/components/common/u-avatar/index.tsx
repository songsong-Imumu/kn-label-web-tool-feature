// 头像

import { UserOutlined } from '@ant-design/icons';
import React from 'react';
import './index.less';

function useLoaded({ crossOrigin, referrerPolicy, src }: HTMLImageElement) {
    const [loaded, setLoaded] = React.useState<boolean | string>(false);

    React.useEffect(() => {
        if (!src) {
            return undefined;
        }

        setLoaded(false);

        let active = true;
        const image = new Image();
        image.onload = () => {
            if (!active) {
                return;
            }
            setLoaded('loaded');
        };
        image.onerror = () => {
            if (!active) {
                return;
            }
            setLoaded('error');
        };
        image.crossOrigin = crossOrigin;
        image.referrerPolicy = referrerPolicy;
        image.src = src;

        return () => {
            active = false;
        };
    }, [crossOrigin, referrerPolicy, src]);

    return loaded;
}
interface UAvatarProps {
    variant?: 'square' | 'rounded';
    src: string;
    alt?: string;
    type?: 'large' | 'small';
    imgProps?: HTMLImageElement;
}

const UAvatar: React.FC<UAvatarProps> = props => {
    const { alt, children: childrenProp, src, variant = 'circular', type, imgProps, ...other } = props;

    let children: any = null;

    // Use a hook instead of onError on the img element to support server-side rendering.
    const loaded = useLoaded({ ...imgProps, src });
    const hasImg = src;
    const hasImgNotFailing = hasImg && loaded !== 'error';

    if (hasImgNotFailing) {
        children = <img alt={alt} src={src} {...other} />;
    } else if (childrenProp != null) {
        children = childrenProp;
    } else if (hasImg && alt) {
        children = alt[0];
    } else {
        children = <UserOutlined />;
    }

    return (
        <div className={`Avatar-root Avatar-root-${type} Avatar-root-${variant}`} {...other}>
            {children}
        </div>
    );
};
export default UAvatar;
