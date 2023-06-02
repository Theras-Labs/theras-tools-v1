import Image from "next/image";

interface IImageProps {
  imgWidth: number;
  imgHeight: number;
}

export const CoinbaseLogo = ({ imgWidth, imgHeight }: IImageProps) => {
  return (
    <Image src="/img/coinbase-logo.svg" width={imgWidth} height={imgHeight} />
  );
};

export const WalletConnectLogo = ({ imgWidth, imgHeight }: IImageProps) => {
  return (
    <Image src="/img/walletconnect.svg" width={imgWidth} height={imgHeight} />
  );
};

export const MetaMaskLogo = ({ imgWidth, imgHeight }: IImageProps) => {
  return (
    <Image src="/img/metamask-icon.svg" width={imgWidth} height={imgHeight} />
  );
};
