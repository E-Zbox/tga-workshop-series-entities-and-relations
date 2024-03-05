// types from the Graph TypeScript library for handling big integers and byte arrays.
import { BigInt, Bytes } from "@graphprotocol/graph-ts";
// event types that the Graph node will listen to from the smart contract.
import {
  Assign,
  PunkBought,
  PunkTransfer,
} from "../generated/Cryptopunks/Cryptopunks";
// schema definitions that we've defined for our subgraph.
import {
  ArtPurchase,
  ArtTransfer,
  Collector,
  DigitalArt,
  PremiumCollector,
  PurchasedDigitalArt,
} from "../generated/schema";
// helpers
import {
  loadOrCreateArtPurchase,
  loadOrCreateArtTransfer,
  loadOrCreateCollector,
  loadOrCreateDigitalArt,
  loadOrCreatePremiumCollector,
  loadOrCreatePurchasedDigitalArt,
} from "./helpers";

// Function to handle 'Assign' events emitted by the contract.
export function handleAssign(event: Assign): void {
  // Convert the 'to' address from the event to a hex string to use as the collector's ID.
  const collectorId = event.params.to.toHexString();

  // Attempt to load an existing or create a new Collector from the subgraph by ID.
  const collector = loadOrCreateCollector(collectorId);

  // Set the wallet address of the collector to the 'to' parameter from the event.
  collector.walletAddress = event.params.to;
  collector.save(); // Save the collector entity to the subgraph.

  // convert the punkIndex from the event to string
  const digitalArtId = event.params.punkIndex.toString();
  // Attempt to load an existing or create a new DigitalArt entity by using the punkIndex as its ID.
  const digitalArt = loadOrCreateDigitalArt(digitalArtId);

  digitalArt.tokenId = event.params.punkIndex; // Set the tokenId of the digital art to the punkIndex from the event.
  digitalArt.owner = collector.id; // Set the owner of the digital art to the ID of the collector.
  digitalArt.save(); // Save the new digital art entity to the subgraph.
}

/**
 *
 * [10:50, 11:08] of TGA - 3 Entities & Relations
 * have an entity that tracks NFT purchase amount and NFT owner using Transfer and PunkTransfer events
 */

// Define a function to handle 'PunkTransfer' events emitted by the Cryptopunks contract.
export function handlePunkTransfer(event: PunkTransfer): void {
  // Convert the punkIndex from the event to a string to use as the digital art's ID.
  const digitalArtId = event.params.punkIndex.toString();

  // Attempt to load an existing DigitalArt entity by its ID.
  const digitalArt = loadOrCreateDigitalArt(digitalArtId);

  // Set its tokenId.
  digitalArt.tokenId = event.params.punkIndex;

  // Retrieve the old owner's ID from the digital art entity.
  const oldCollectorId = digitalArt.owner;

  // Convert the new owner's address to a hex string to use as their ID.
  const newCollectorId = event.params.to.toHexString();

  // Attempt to load an existing collector (the new owner) from the subgraph by ID.
  let newCollector = loadOrCreateCollector(newCollectorId);

  newCollector.walletAddress = event.params.to; // Set the wallet address.
  newCollector.save(); // Persist the new collector entity to the subgraph.

  // Create a new ArtTransfer entity to record the transfer of the digital art.
  const transferId = event.transaction.hash.toHexString();
  let transfer = loadOrCreateArtTransfer(transferId); // Use the transaction hash as the ID for uniqueness.
  transfer.art = digitalArtId; // Associate the transfer with the digital art.
  transfer.oldOwner = Bytes.fromHexString(oldCollectorId); // Record the old owner. Requires conversion from string to Bytes.
  transfer.newOwner = event.params.to; // Record the new owner's address.
  transfer.timestamp = event.block.timestamp; // Record the timestamp of the transfer.
  transfer.save(); // Save the art transfer entity to the subgraph.

  // Update the digital art's owner to the new owner and save the changes.
  digitalArt.owner = newCollector.id;
  digitalArt.save();
}

export function handlePunkBought(event: PunkBought): void {
  /**
   * event PunkBought(
   *  uint indexed punkIndex, uint value,
   *  address indexed fromAddress, address indexed toAddress
   * );
   */
  // let's define PremiumCollector entity
  const premiumCollectorId = event.params.toAddress.toHexString();

  const premiumCollector = loadOrCreatePremiumCollector(premiumCollectorId);

  premiumCollector.whoAreYou = event.params.toAddress;
  premiumCollector.save();

  // let's define PurchasedDigitalArt entity
  const purchasedDigitalArtId = event.params.punkIndex.toString();

  const purchasedDigitalArt = loadOrCreatePurchasedDigitalArt(
    purchasedDigitalArtId
  );

  purchasedDigitalArt.tokenId = BigInt.fromString(purchasedDigitalArtId);
  purchasedDigitalArt.owner = premiumCollectorId;
  purchasedDigitalArt.save();

  // let's define ArtPurchase entity
  const artPurchaseId = event.transaction.hash.toHexString();

  const artPurchase = loadOrCreateArtPurchase(artPurchaseId);

  artPurchase.art = purchasedDigitalArtId;
  artPurchase.oldOwner = event.params.fromAddress;
  artPurchase.newOwner = event.params.toAddress;
  artPurchase.price = event.params.value;
  artPurchase.timestamp = event.block.timestamp;
  artPurchase.save();
}
