import { pageLoading, showButtons } from './components/index.js';

const showButton = document.getElementById('showButton')

document.addEventListener('DOMContentLoaded', pageLoading);
showButton.addEventListener('click', showButtons)
