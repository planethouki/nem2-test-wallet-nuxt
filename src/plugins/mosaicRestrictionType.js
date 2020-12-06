import Vue from 'vue'
import { MosaicRestrictionType } from 'symbol-sdk'

Vue.prototype.$mosaicRestrictionTypes = [
  { label: '=', type: MosaicRestrictionType.EQ },
  { label: '<=', type: MosaicRestrictionType.GE },
  { label: '<', type: MosaicRestrictionType.GT },
  { label: '>=', type: MosaicRestrictionType.LE },
  { label: '>', type: MosaicRestrictionType.LT },
  { label: '!=', type: MosaicRestrictionType.NE },
  { label: 'NONE', type: MosaicRestrictionType.NONE }
]
