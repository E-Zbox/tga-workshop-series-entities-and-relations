import { BigInt, Bytes } from "@graphprotocol/graph-ts";
// entity types
import {
  ArtPurchase,
  ArtTransfer,
  Collector,
  DigitalArt,
  PremiumCollector,
  PurchasedDigitalArt,
} from "../../generated/schema";

export const loadOrCreateArtPurchase = (id: string): ArtPurchase => {
  let artPurchaseExists = ArtPurchase.load(id);

  if (!artPurchaseExists) {
    artPurchaseExists = new ArtPurchase(id);
    artPurchaseExists.art = "";
    artPurchaseExists.oldOwner = new Bytes(0);
    artPurchaseExists.newOwner = new Bytes(0);
    artPurchaseExists.price = new BigInt(0);
    artPurchaseExists.timestamp = new BigInt(0);
  }

  return artPurchaseExists;
};

export const loadOrCreateArtTransfer = (id: string): ArtTransfer => {
  let artTransferExists = ArtTransfer.load(id);

  if (!artTransferExists) {
    artTransferExists = new ArtTransfer(id);
    artTransferExists.amount = new BigInt(1);
    artTransferExists.art = "";
    artTransferExists.oldOwner = new Bytes(0);
    artTransferExists.newOwner = new Bytes(0);
    artTransferExists.timestamp = new BigInt(0);
  }

  return artTransferExists;
};

export const loadOrCreateCollector = (id: string): Collector => {
  let collectorExists = Collector.load(id);

  if (!collectorExists) {
    collectorExists = new Collector(id);
    collectorExists.walletAddress = new Bytes(0);
  }

  return collectorExists;
};

export const loadOrCreateDigitalArt = (id: string): DigitalArt => {
  let digitalArtExists = DigitalArt.load(id);

  if (!digitalArtExists) {
    digitalArtExists = new DigitalArt(id);
    digitalArtExists.tokenId = new BigInt(0);
    digitalArtExists.owner = "";
  }

  return digitalArtExists;
};

export const loadOrCreatePremiumCollector = (id: string): PremiumCollector => {
  let premiumCollectorExists = PremiumCollector.load(id);

  if (!premiumCollectorExists) {
    premiumCollectorExists = new PremiumCollector(id);
    premiumCollectorExists.whoAreYou = new Bytes(0);
  }

  return premiumCollectorExists;
};

export const loadOrCreatePurchasedDigitalArt = (
  id: string
): PurchasedDigitalArt => {
  let purchasedDigitalArtExists = PurchasedDigitalArt.load(id);

  if (!purchasedDigitalArtExists) {
    purchasedDigitalArtExists = new PurchasedDigitalArt(id);
    purchasedDigitalArtExists.tokenId = new BigInt(0);
    purchasedDigitalArtExists.owner = "";
  }

  return purchasedDigitalArtExists;
};
