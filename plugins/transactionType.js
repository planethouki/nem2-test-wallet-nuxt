import Vue from 'vue'
import { TransactionType } from 'nem2-sdk'

Vue.prototype.$transactionTypes = [
  { label: 'Transfer', entityType: TransactionType.TRANSFER },
  { label: 'Namespace', entityType: TransactionType.REGISTER_NAMESPACE },
  { label: 'Mosaic Supply Change', entityType: TransactionType.MOSAIC_SUPPLY_CHANGE },
  { label: 'Modify Multisig', entityType: TransactionType.MODIFY_MULTISIG_ACCOUNT },
  { label: 'Aggregate Complete', entityType: TransactionType.AGGREGATE_COMPLETE },
  { label: 'Aggregate Bonded', entityType: TransactionType.AGGREGATE_BONDED },
  { label: 'Lock Funds', entityType: TransactionType.LOCK },
  { label: 'Secret Lock', entityType: TransactionType.SECRET_LOCK },
  { label: 'Secret Proof', entityType: TransactionType.SECRET_PROOF },
  { label: 'Address Alias', entityType: TransactionType.ADDRESS_ALIAS },
  { label: 'Mosaic Alias', entityType: TransactionType.MOSAIC_ALIAS },
  { label: 'Account Property Address', entityType: TransactionType.MODIFY_ACCOUNT_PROPERTY_ADDRESS },
  { label: 'Account Property Mosaic', entityType: TransactionType.MODIFY_ACCOUNT_PROPERTY_MOSAIC },
  { label: 'Account Property Entity Type', entityType: TransactionType.MODIFY_ACCOUNT_PROPERTY_ENTITY_TYPE }
]
