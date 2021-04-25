---
title: Tab test
category: tab
id: tab-test
---

This is a tab test doc.

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs
  defaultValue="apple"
  values={[
    {label: 'Apple', value: 'apple'},
    {label: 'Orange', value: 'orange'},
    {label: 'Banana', value: 'banana'},
  ]}>
  <TabItem value="apple">This is an apple.</TabItem>
  <TabItem value="orange">This is an orange.</TabItem>
  <TabItem value="banana">This is a banana.</TabItem>
</Tabs>;

This is a tab-test doc.