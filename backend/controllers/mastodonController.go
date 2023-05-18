package controllers

import (
	"example/helpers"
	"fmt"
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
)

// GetMastodonMentalCount
// @Summary return mastodon_mental_count
// @Description return the mastodon_mental_count MapReduce view in the mental_disabled_db database
// @Tags mastodon
// @Accept json
// @Produce json
// @Success 200 {string} GetMastodonMentalCount
// @Router /mastodon/mental/count [get]
func GetMastodonMentalCount(c *gin.Context) {
	url := fmt.Sprintf(
		"http://%v:%v@%v:5984/mental_disabled_db/_design/mastodon_mental_count/_view/count_view?group_level=1",
		dbUser, dbPass, dbHost)
	data, err := helpers.GetData(url)
	if err != nil {
		log.Fatalln(err)
	}
	c.JSON(http.StatusOK, gin.H{"data": data})
}

// GetMastodonMentalOutput
// @Summary return mastodon_mental_output
// @Description return the mastodon_mental_output MapReduce view in the mental_disabled_db database
// @Tags mastodon
// @Accept json
// @Produce json
// @Success 200 {string} GetMastodonMentalOutput
// @Router /mastodon/mental/output [get]
func GetMastodonMentalOutput(c *gin.Context) {
	url := fmt.Sprintf(
		"http://%v:%v@%v:5984/mental_disabled_db/_design/mastodon_mental_output/_view/avg_score_view?group_level=1",
		dbUser, dbPass, dbHost)
	data, err := helpers.GetData(url)
	if err != nil {
		log.Fatalln(err)
	}
	c.JSON(http.StatusOK, gin.H{"data": data})
}

// GetMastodonNonMentalCount
// @Summary return mastodon_non_mental_count
// @Description return the mastodon_non_mental_count MapReduce view in the non_mental_disabled_db database
// @Tags mastodon
// @Accept json
// @Produce json
// @Success 200 {string} GetMastodonNonMentalCount
// @Router /mastodon/non-mental/count [get]
func GetMastodonNonMentalCount(c *gin.Context) {
	url := fmt.Sprintf(
		"http://%v:%v@%v:5984/non_mental_disabled_db/_design/mastodon_non_mental_count/_view/count_view?group_level=1",
		dbUser, dbPass, dbHost)
	data, err := helpers.GetData(url)
	if err != nil {
		log.Fatalln(err)
	}
	c.JSON(http.StatusOK, gin.H{"data": data})
}

// GetMastodonNonMentalOutput
// @Summary return mastodon_non_mental_output
// @Description return the mastodon_non_mental_output MapReduce view in the non_mental_disabled_db database
// @Tags mastodon
// @Accept json
// @Produce json
// @Success 200 {string} GetMastodonNonMentalOutput
// @Router /mastodon/non-mental/output [get]
func GetMastodonNonMentalOutput(c *gin.Context) {
	url := fmt.Sprintf(
		"http://%v:%v@%v:5984/non_mental_disabled_db/_design/mastodon_non_mental_output/_view/avg_score_view?group_level=1",
		dbUser, dbPass, dbHost)
	data, err := helpers.GetData(url)
	if err != nil {
		log.Fatalln(err)
	}
	c.JSON(http.StatusOK, gin.H{"data": data})
}
