using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using LightsOut_Game.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace LightsOut_Game.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GameController : ControllerBase
    {
        // GET: api/game
        [HttpGet]
        public IEnumerable<Light> GetLights()
        {
            return Lights(null);
        }

        // POST: api/game
        [HttpPost]
        public IActionResult PostLight([FromBody] Light Light)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            return Ok(Lights(Light));
        }

        private List<Light> Lights(Light lightClicked)
        {
            int gridsize_x = 5;
            int gridsize_y = 5;

            List<Light> LightList = new List<Light>();
            List<Coordinate> lightsOn = new List<Coordinate>();

            if (lightClicked == null)
            {
                
                Random random = new Random();

                //Randomize number of lights that are on
                int totalLightsOn = random.Next(1, 4);


                //Randomize the coordinates where the on-lights appear
                for (int i = 0; i < totalLightsOn; i++)
                {
                    lightsOn.Add(new Coordinate { x = random.Next(1, 5), y = random.Next(1, 5) });
                }
            }
            else
            {
                //Coordinates of lights to be toggled
                lightsOn.Add(new Coordinate { x = lightClicked.PositionX, y = lightClicked.PositionY });
                lightsOn.Add(new Coordinate { x = lightClicked.PositionX, y = lightClicked.PositionY + 1 });
                lightsOn.Add(new Coordinate { x = lightClicked.PositionX, y = lightClicked.PositionY - 1 });
                lightsOn.Add(new Coordinate { x = lightClicked.PositionX + 1, y = lightClicked.PositionY });
                lightsOn.Add(new Coordinate { x = lightClicked.PositionX - 1, y = lightClicked.PositionY });
            }

            int LightCount = 0;
            for (var x = 0; x < gridsize_x; x++)
            {
                for (var y = 0; y < gridsize_y; y++)
                {
                    LightCount++;
                    if (lightsOn.Any(l => l.x == x && l.y == y))
                    {
                        LightList.Add(new Light { Id = LightCount, Toggle = true, PositionX = x, PositionY = y });
                    }
                    else if (lightClicked == null)
                    {
                        LightList.Add(new Light { Id = LightCount, Toggle = false, PositionX = x, PositionY = y });
                    }
                }
            }
            return LightList;
        }
    }
}