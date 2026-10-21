import { Component, type PropsWithChildren } from 'react';
import InternalServerErrorPage from '../../pages/error/InternalServerErrorPage';

/** Replace the entire page, including its sidebar, while keeping the site shell. */
export default class PageErrorBoundary extends Component<PropsWithChildren, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? <InternalServerErrorPage /> : this.props.children;
  }
}
