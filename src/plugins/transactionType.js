import Vue from 'vue'
import { TransactionType } from 'symbol-sdk'

Vue.prototype.$transactionTypes = [
  { label: 'Transfer', entityType: TransactionType.TRANSFER },
  { label: 'Namespace', entityType: TransactionType.NAMESPACE_REGISTRATION },
  { label: 'Mosaic Supply Change', entityType: TransactionType.MOSAIC_SUPPLY_CHANGE },
  { label: 'Modify Multisig', entityType: TransactionType.MULTISIG_ACCOUNT_MODIFICATION },
  { label: 'Aggregate Complete', entityType: TransactionType.AGGREGATE_COMPLETE },
  { label: 'Aggregate Bonded', entityType: TransactionType.AGGREGATE_BONDED },
  { label: 'Lock Funds', entityType: TransactionType.LOCK },
  { label: 'Secret Lock', entityType: TransactionType.SECRET_LOCK },
  { label: 'Secret Proof', entityType: TransactionType.SECRET_PROOF },
  { label: 'Address Alias', entityType: TransactionType.ADDRESS_ALIAS },
  { label: 'Mosaic Alias', entityType: TransactionType.MOSAIC_ALIAS },
  { label: 'Account Restriction Address', entityType: TransactionType.ACCOUNT_ADDRESS_RESTRICTION },
  { label: 'Account Restriction Mosaic', entityType: TransactionType.ACCOUNT_MOSAIC_RESTRICTION },
  { label: 'Account Restriction Operation', entityType: TransactionType.ACCOUNT_OPERATION_RESTRICTION },
  { label: 'Account Link', entityType: TransactionType.ACCOUNT_KEY_LINK },
  { label: 'Mosaic Global Restriction', entityType: TransactionType.MOSAIC_GLOBAL_RESTRICTION },
  { label: 'Mosaic Address Restriction', entityType: TransactionType.MOSAIC_ADDRESS_RESTRICTION }
]
