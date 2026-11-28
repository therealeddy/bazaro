import type { NextConfig } from 'next';

import { withMonitoring } from '@bazaro/monitoring/next/config';

const nextConfig: NextConfig = {};

export default withMonitoring(nextConfig, { project: 'bazaro-landing' });
