<script setup lang="ts">
import { computed } from 'vue'
import { useColorScheme } from '@/composables/useColorScheme'

import LogoIcon from '@/assets/logo.svg?component'

const APP_NAME = 'RMS Tasks'

const { isDark } = useColorScheme()

const CustomLogo = computed(() => {
	const lightLogo = window.CUSTOM_LOGO_URL
	const darkLogo = window.CUSTOM_LOGO_URL_DARK

	if (!lightLogo && !darkLogo) return ''
	if (!darkLogo) return lightLogo
	if (!lightLogo) return darkLogo

	return isDark.value ? darkLogo : lightLogo
})
</script>

<template>
	<div class="logo-mark">
		<img
			v-if="CustomLogo"
			:src="CustomLogo"
			:alt="APP_NAME"
			class="logo-custom"
		>
		<template v-else>
			<LogoIcon
				class="logo-icon"
				aria-hidden="true"
			/>
			<span class="logo-text">{{ APP_NAME }}</span>
		</template>
	</div>
</template>

<style lang="scss" scoped>
.logo-mark {
	display: flex;
	align-items: center;
	gap: .5rem;
	color: var(--logo-text-color);
	max-inline-size: 100%;
}

.logo-icon {
	flex-shrink: 0;
	block-size: 2.5rem;
	inline-size: 2.5rem;
}

.logo-custom {
	max-inline-size: 168px;
	max-block-size: 48px;
}

.logo-text {
	font-family: $vikunja-font;
	font-size: 1.375rem;
	font-weight: 700;
	line-height: 1;
	white-space: nowrap;
}
</style>
