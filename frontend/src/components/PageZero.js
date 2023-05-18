import React from "react";

function PageZero() {
  return (
    <div>
      <h1 className="page-zero-h1">Social Media Data Investigation</h1>
      <h3 className="page-zero-h3">
        In this page, we utilized data from 2 social media platforms(Twitter and
        Mastodon) to analyse how people perceive and discuss mental issues. We
        focused on demonstrating our sentiment analysis since it reflects the
        universal attitudes of the public, and to what extent they are more
        optimistic or negative about mental illness.
        <br />
        <br />
        For each post, we calculated three separate sentiments scores that
        indicate the proportion of that category in post content. The level of
        public awareness of mental health in a specific society cohort is
        respresented dominanting sentiment score.
      </h3>

      <h1 className="page-zero-h1">Official Data Investigation</h1>
      <h3 className="page-zero-h3">
        In this Page, we explored the government's actions in the mental health
        field as well as how mental health topics and services spread into
        communities in Victoria. The map contains information about the
        estimated percentages of people having mental health issues across
        different LGAs. The line chart gives the increasing trend of
        the recurrent expense of the government of Victoria towards diverse
        mental services from 2011-2021.
        <br />
        <br />
        Combining the investment tendency of the Victoria government in mental
        health issues with the estimated percentage of people with a mental
        health problem in VIC, the page provides insight for the local
        government on investing location in the future.
      </h3>
    </div>
  );
}

export default PageZero;
